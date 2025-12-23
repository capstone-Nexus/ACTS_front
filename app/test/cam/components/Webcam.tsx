'use client';

import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

interface CameraProps {
  onTurnChange?: (count: number) => void;
  onTiltChange?: (count: number) => void;
  onAwayChange?: (count: number) => void;
}

export default function Camera({ onTurnChange, onTiltChange, onAwayChange }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [turnCount, setTurnCount] = useState(0);
  const [tiltCount, setTiltCount] = useState(0);
  const [awayCount, setAwayCount] = useState(0);

  useEffect(() => {
    onTurnChange?.(turnCount);
  }, [turnCount]);

  useEffect(() => {
    onTiltChange?.(tiltCount);
  }, [tiltCount]);

  useEffect(() => {
    onAwayChange?.(awayCount);
  }, [awayCount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const init = async () => {
      const mpCamera = await import('@mediapipe/camera_utils');
      const mpFaceMesh = await import('@mediapipe/face_mesh');

      const videoElement = webcamRef.current?.video as HTMLVideoElement;
      const canvasElement = canvasRef.current as HTMLCanvasElement;
      const canvasCtx = canvasElement.getContext('2d');
      if (!videoElement || !canvasCtx) return;

      // 비디오 로드 대기 후 canvas 크기 설정
      await new Promise<void>(resolve => {
        if (videoElement.readyState >= 2) {
          canvasElement.width = videoElement.videoWidth;
          canvasElement.height = videoElement.videoHeight;
          resolve();
        } else {
          videoElement.onloadedmetadata = () => {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            resolve();
          };
        }
      });

      const faceMesh = new mpFaceMesh.FaceMesh({
        locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      // 감지 상태 변수
      let turnDetected = false;
      let tiltDetected = false;
      let awayDetected = false;

      // 랜드마크 인덱스
      const LEFT_EAR = 234;
      const RIGHT_EAR = 454;
      const NOSE_TIP = 1;
      const LEFT_EYE = 33;
      const RIGHT_EYE = 263;

      faceMesh.onResults((results: { image: HTMLVideoElement; multiFaceLandmarks?: Array<Array<{x: number; y: number; z: number}>> }) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          // 얼굴이 감지됨 - 자리 복귀
          if (awayDetected) {
            awayDetected = false;
          }

          for (const landmarks of results.multiFaceLandmarks) {
            // ✅ 고개 좌우 회전 감지 (Yaw)
            const leftEar = landmarks[LEFT_EAR];
            const rightEar = landmarks[RIGHT_EAR];
            const nose = landmarks[NOSE_TIP];
            const distLeft = Math.abs(nose.x - leftEar.x);
            const distRight = Math.abs(nose.x - rightEar.x);
            const ratio = distLeft / (distRight + 1e-6);

            // 기준 자세는 ratio ≈ 1
            if (!turnDetected && (ratio > 1.5 || ratio < 0.66)) {
              setTurnCount(prev => prev + 1);
              turnDetected = true;
              console.log('↔️ 고개 회전 감지');
            }
            // 정면 복귀 시 다시 감지 가능
            if (turnDetected && ratio > 0.9 && ratio < 1.1) {
              turnDetected = false;
            }

            // ✅ 고개 기울임 감지 (Roll)
            const leftEye = landmarks[LEFT_EYE];
            const rightEye = landmarks[RIGHT_EYE];
            const eyeDy = leftEye.y - rightEye.y; // 수평 기준

            if (!tiltDetected && Math.abs(eyeDy) > 0.04) {
              setTiltCount(prev => prev + 1);
              tiltDetected = true;
              console.log('↕️ 고개 기울임 감지');
            }
            // 수평 복귀 시 다시 감지 가능
            if (tiltDetected && Math.abs(eyeDy) < 0.02) {
              tiltDetected = false;
            }

            // ✅ 고개 회전/기울임 상태 확인
            const isTurned = ratio > 1.5 || ratio < 0.66;
            const isTilted = Math.abs(eyeDy) > 0.04;

            // ✅ 랜드마크 점 표시 (고개 회전/기울임 시 빨간색, 아니면 흰색)
            for (const point of landmarks) {
              const x = point.x * canvasElement.width;
              const y = point.y * canvasElement.height;
              canvasCtx.beginPath();
              canvasCtx.arc(x, y, 1, 0, 2 * Math.PI);
              canvasCtx.fillStyle = isTurned || isTilted ? 'red' : 'white';
              canvasCtx.fill();
            }
          }
        } else {
          // 얼굴이 감지되지 않음 - 자리 이탈
          if (!awayDetected) {
            setAwayCount(prev => prev + 1);
            awayDetected = true;
            console.log('🚶 자리 이탈 감지');
          }
        }

        canvasCtx.restore();
      });

      const camera = new mpCamera.Camera(videoElement, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement });
        },
        width: videoElement.videoWidth,
        height: videoElement.videoHeight
      });

      camera.start();
    };

    init();
  }, []);

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        style={{ display: 'none' }}
        videoConstraints={{
          facingMode: 'user',
          width: 1280,
          height: 720
        }}
      />
      <canvas ref={canvasRef} style={{ width: '650px', height: '350px', objectFit: 'cover' }} />
    </>
  );
}
