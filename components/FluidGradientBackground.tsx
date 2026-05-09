'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/lib/ThemeContext';

export function FluidGradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uLightMode: { value: theme === 'light' ? 1.0 : 0.0 }
    };

    const fragmentShader = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uLightMode;
      varying vec2 vUv;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = vUv;
        float aspect = uResolution.x / uResolution.y;
        vec2 p = (uv - 0.5);
        p.x *= aspect;
        
        float t = uTime * 0.1;

        // Theme colors
        vec3 purpleDark = vec3(0.545, 0.36, 0.96);  // #8b5cf6
        vec3 cyanDark = vec3(0.06, 0.71, 0.83);    // #06b6d4
        vec3 magentaDark = vec3(0.85, 0.27, 0.95); // #d946ef
        vec3 bgDark = vec3(0.01, 0.0, 0.05);

        vec3 purpleLight = vec3(0.65, 0.5, 0.95);    // Slightly more saturated purple
        vec3 cyanLight = vec3(0.4, 0.8, 0.95);      // Slightly more saturated cyan
        vec3 magentaLight = vec3(0.95, 0.6, 0.85);  // Slightly more saturated magenta
        vec3 bgLight = vec3(1.0, 1.0, 1.0);        // Pure white

        vec3 purple = mix(purpleDark, purpleLight, uLightMode);
        vec3 cyan = mix(cyanDark, cyanLight, uLightMode);
        vec3 magenta = mix(magentaDark, magentaLight, uLightMode);
        vec3 bg = mix(bgDark, bgLight, uLightMode);
        
        vec3 finalColor = bg;

        // Wave 1: Broad Purple
        float n1 = snoise(vec2(p.x * 0.3 + t, p.y * 0.3));
        float wave1 = p.y + sin(p.x * 0.6 + t * 0.5) * 0.4 + n1 * 0.3;
        float mask1 = pow(1.0 - abs(wave1), 4.0);
        finalColor = mix(finalColor, purple, mask1 * (uLightMode > 0.5 ? 0.5 : 0.6));

        // Wave 2: Sinuous Magenta
        float n2 = snoise(vec2(p.x * 0.5 - t * 0.8, p.y * 0.2));
        float wave2 = p.y + cos(p.x * 0.8 - t * 0.4) * 0.3 + n2 * 0.2;
        float mask2 = pow(1.0 - abs(wave2), 7.0);
        finalColor = mix(finalColor, magenta, mask2 * (uLightMode > 0.5 ? 0.6 : 0.8));

        // Wave 3: Bright Cyan
        float n3 = snoise(vec2(p.x * 0.8 + t * 1.2, p.y * 0.1));
        float wave3 = p.y + sin(p.x * 1.2 + t * 0.7) * 0.25 + n3 * 0.15;
        float mask3 = pow(1.0 - abs(wave3), 10.0);
        finalColor = mix(finalColor, cyan, mask3 * (uLightMode > 0.5 ? 0.7 : 0.9));

        // Energy Glow (only in dark mode)
        float energy = mask1 * mask2 * 2.0 + mask2 * mask3 * 2.0;
        finalColor += cyan * energy * (1.0 - uLightMode) * 0.5;

        // Vignette
        float vScale = mix(1.6, 1.2, uLightMode);
        float vignette = smoothstep(1.5, 0.2, length(uv - 0.5) * vScale);
        finalColor = mix(finalColor, finalColor * vignette, 1.0 - uLightMode * 0.5);

        // Contrast & Saturation
        finalColor = pow(finalColor, vec3(uLightMode > 0.5 ? 0.9 : 1.2));
        finalColor *= mix(1.3, 1.0, uLightMode);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId: number;
    let startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      uniforms.uTime.value = (currentTime - startTime) * 0.001;
      
      // Smoothly transition light mode uniform
      const targetLight = theme === 'light' ? 1.0 : 0.0;
      uniforms.uLightMode.value += (targetLight - uniforms.uLightMode.value) * 0.05;
      
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ filter: `blur(${theme === 'light' ? '30px' : '20px'}) brightness(1.1) saturate(1.2)` }}
    />
  );
}
