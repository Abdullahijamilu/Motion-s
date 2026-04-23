
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SignLanguageOutput, SIGN_POSITIONS } from '../constants';

interface SignAvatarProps {
  output: SignLanguageOutput | null;
  playbackIndex: number;
  playbackProgress: number;
  isPlaying: boolean;
}

export default function SignAvatar({ output, playbackIndex }: SignAvatarProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const skeletonRef = useRef<{
    torso: THREE.Mesh;
    head: THREE.Mesh;
    rArm: THREE.Group;
    rElbow: THREE.Group;
    lArm: THREE.Group;
    lElbow: THREE.Group;
  } | null>(null);

  // Targets for lerping
  const targetsRef = useRef({
    rArm: new THREE.Euler(),
    rElbow: new THREE.Euler(),
    lArm: new THREE.Euler(),
    lElbow: new THREE.Euler(),
  });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.1, 2.7);
    camera.lookAt(0, 0.9, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0f172a, 1.0); 
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 4, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x6366f1, 1, 10);
    pointLight.position.set(-2, 1, 2);
    scene.add(pointLight);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFDBCB4, roughness: 0.3 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.22), shirtMat);
    torso.position.y = 0.9;
    scene.add(torso);

    // Neck & Head
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.15), skinMat);
    neck.position.y = 1.32;
    scene.add(neck);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18), skinMat);
    head.position.y = 1.6;
    scene.add(head);

    const createArm = (isRight: boolean) => {
      const side = isRight ? 1 : -1;
      const armGroup = new THREE.Group();
      armGroup.position.set(0.28 * side, 0.32, 0);
      
      const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.1), shirtMat);
      armGroup.add(shoulderJoint);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.38), shirtMat);
      upperArm.position.y = -0.19;
      armGroup.add(upperArm);

      const elbowGroup = new THREE.Group();
      elbowGroup.position.y = -0.38;
      armGroup.add(elbowGroup);

      const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.06), skinMat);
      elbowGroup.add(elbowJoint);

      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.34), skinMat);
      foreArm.position.y = -0.17;
      elbowGroup.add(foreArm);

      const handGroup = new THREE.Group();
      handGroup.position.y = -0.34;
      elbowGroup.add(handGroup);

      const handPalm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.14, 0.04), skinMat);
      handPalm.position.y = -0.07;
      handGroup.add(handPalm);

      // Fingers
      for (let i = 0; i < 4; i++) {
        const finger = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.015), skinMat);
        finger.position.set((i * 0.025) - 0.035, -0.14, 0);
        handGroup.add(finger);
      }

      return { armGroup, elbowGroup };
    };

    const right = createArm(true);
    const left = createArm(false);
    torso.add(right.armGroup);
    torso.add(left.armGroup);

    skeletonRef.current = {
      torso, head,
      rArm: right.armGroup, rElbow: right.elbowGroup,
      lArm: left.armGroup, lElbow: left.elbowGroup,
    };

    const animate = () => {
      const frame = requestAnimationFrame(animate);
      
      const t = performance.now() * 0.0015; // Slowed down slightly
      if (skeletonRef.current) {
        // Subtle humanoid idle: breathing + slight torso sway + head bob
        skeletonRef.current.torso.position.y = 0.9 + Math.sin(t) * 0.004;
        skeletonRef.current.torso.rotation.z = Math.sin(t * 0.5) * 0.01; // Slight sway
        skeletonRef.current.head.position.y = 1.62 + Math.sin(t * 1.2) * 0.002;
        skeletonRef.current.head.rotation.y = Math.sin(t * 0.3) * 0.02; // Very slight curiosity look
        
        // Consistent Smooth Lerping (using a slightly slower speed for more fluid signs)
        const speed = 0.12; 
        
        // Right Arm
        skeletonRef.current.rArm.rotation.x = THREE.MathUtils.lerp(skeletonRef.current.rArm.rotation.x, targetsRef.current.rArm.x, speed);
        skeletonRef.current.rArm.rotation.y = THREE.MathUtils.lerp(skeletonRef.current.rArm.rotation.y, targetsRef.current.rArm.y, speed);
        skeletonRef.current.rArm.rotation.z = THREE.MathUtils.lerp(skeletonRef.current.rArm.rotation.z, targetsRef.current.rArm.z, speed);
        skeletonRef.current.rElbow.rotation.x = THREE.MathUtils.lerp(skeletonRef.current.rElbow.rotation.x, targetsRef.current.rElbow.x, speed);
        
        // Left Arm
        skeletonRef.current.lArm.rotation.x = THREE.MathUtils.lerp(skeletonRef.current.lArm.rotation.x, targetsRef.current.lArm.x, speed);
        skeletonRef.current.lArm.rotation.y = THREE.MathUtils.lerp(skeletonRef.current.lArm.rotation.y, targetsRef.current.lArm.y, speed);
        skeletonRef.current.lArm.rotation.z = THREE.MathUtils.lerp(skeletonRef.current.lArm.rotation.z, targetsRef.current.lArm.z, speed);
        skeletonRef.current.lElbow.rotation.x = THREE.MathUtils.lerp(skeletonRef.current.lElbow.rotation.x, targetsRef.current.lElbow.x, speed);
      }

      renderer.render(scene, camera);
      return frame;
    };
    const animId = animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!output || playbackIndex === -1) {
      // Return to neutral
      const low = SIGN_POSITIONS.neutral;
      targetsRef.current.rArm.set(low.shoulder[0], low.shoulder[1], low.shoulder[2]);
      targetsRef.current.rElbow.set(low.elbow[0], low.elbow[1], low.elbow[2]);
      targetsRef.current.lArm.set(low.shoulder[0], low.shoulder[1], -low.shoulder[2]);
      targetsRef.current.lElbow.set(low.elbow[0], low.elbow[1], low.elbow[2]);
      return;
    }

    const params = output.handshape_params[playbackIndex];
    if (!params) return;

    const pos = SIGN_POSITIONS[params.location] || SIGN_POSITIONS.neutral;
    const isRight = params.dominant_hand === 'right';

    if (isRight) {
      targetsRef.current.rArm.set(pos.shoulder[0], pos.shoulder[1], pos.shoulder[2]);
      targetsRef.current.rElbow.set(pos.elbow[0], pos.elbow[1], pos.elbow[2]);
      // Relax left
      const neutral = SIGN_POSITIONS.neutral;
      targetsRef.current.lArm.set(neutral.shoulder[0], neutral.shoulder[1], -neutral.shoulder[2]);
      targetsRef.current.lElbow.set(neutral.elbow[0], neutral.elbow[1], neutral.elbow[2]);
    } else {
      targetsRef.current.lArm.set(pos.shoulder[0], pos.shoulder[1], -pos.shoulder[2]);
      targetsRef.current.lElbow.set(pos.elbow[0], pos.elbow[1], pos.elbow[2]);
      // Relax right
      const neutral = SIGN_POSITIONS.neutral;
      targetsRef.current.rArm.set(neutral.shoulder[0], neutral.shoulder[1], neutral.shoulder[2]);
      targetsRef.current.rElbow.set(neutral.elbow[0], neutral.elbow[1], neutral.elbow[2]);
    }
  }, [playbackIndex, output]);

  return <div ref={mountRef} className="w-full h-full" />;
}
