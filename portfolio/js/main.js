import * as THREE from 'three';

class ThreeScene {
    constructor() {
        this.canvas = document.querySelector('#bg-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });

        this.objects = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Position Camera
        this.camera.position.z = 5;

        this.addParticles();
        this.addShapes();
        this.addLights();

        this.bindEvents();
        this.animate();
    }

    addParticles() {
        const particlesCount = 2000;
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color('#818cf8');
        const color2 = new THREE.Color('#2dd4bf');

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i] = mixedColor.r;
            colors[i + 1] = mixedColor.g;
            colors[i + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.03,
            vertexColors: true,
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    addShapes() {
        // Stylish Torus Knot
        const torusGeom = new THREE.TorusKnotGeometry(1.4, 0.4, 150, 20);
        const torusMat = new THREE.MeshStandardMaterial({
            color: 0x818cf8,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            emissive: 0x818cf8,
            emissiveIntensity: 0.2
        });

        this.mainShape = new THREE.Mesh(torusGeom, torusMat);
        this.scene.add(this.mainShape);
        this.objects.push(this.mainShape);

        // Add smaller floating Orbs
        for (let i = 0; i < 8; i++) {
            const geom = new THREE.SphereGeometry(Math.random() * 0.4, 32, 32);
            const mat = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0x818cf8 : 0x2dd4bf,
                transparent: true,
                opacity: 0.1,
                wireframe: true
            });
            const orb = new THREE.Mesh(geom, mat);
            orb.position.set(
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 6
            );
            this.scene.add(orb);
            this.objects.push({
                mesh: orb,
                speed: Math.random() * 0.008 + 0.002,
                offset: Math.random() * Math.PI * 2
            });
        }
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x818cf8, 20);
        pointLight.position.set(5, 5, 5);
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x2dd4bf, 20);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // Smooth mouse movement
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

        // Animate main shape
        if (this.mainShape) {
            this.mainShape.rotation.x = time * 0.2;
            this.mainShape.rotation.y = time * 0.3;
            this.mainShape.position.x = this.mouse.x * 0.5;
            this.mainShape.position.y = this.mouse.y * 0.5;
        }

        // Animate particles
        this.particles.rotation.y = time * 0.05 + this.mouse.x * 0.1;
        this.particles.rotation.z = time * 0.03;

        // Animate orbs
        this.objects.forEach(obj => {
            if (obj.mesh) {
                obj.mesh.position.y += Math.sin(time + obj.offset) * 0.002;
                obj.mesh.rotation.x += 0.01;
                obj.mesh.rotation.y += 0.01;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// --- Skills Sphere Helper ---
class SkillsSphere {
    constructor() {
        this.container = document.querySelector('#skills-sphere');
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.offsetWidth / this.container.offsetHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        this.init();
    }

    init() {
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 3;

        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshPhongMaterial({
            color: 0x00e5ff,
            wireframe: true,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.2
        });
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);

        const light = new THREE.PointLight(0xffffff, 2);
        light.position.set(2, 2, 2);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.sphere.rotation.x += 0.005;
        this.sphere.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }
}

// Instantiate Global Background
const threeScene = new ThreeScene();

// Instantiate Skills Sphere
window.addEventListener('DOMContentLoaded', () => {
    new SkillsSphere();
});

// Robust Loader Removal
const removeLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
};

window.addEventListener('load', removeLoader);
setTimeout(removeLoader, 3000); // Fallback if image load hangs

// --- Mobile Menu Toggle ---
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }
});
// --- WhatsApp Contact Form Redirection ---
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Your WhatsApp Number (+91 for India)
            const phoneNumber = "916371401928";

            // Construct the message
            const waMessage = `*New Inquiry from Portfolio*%0A%0A` +
                `*Name:* ${encodeURIComponent(name)}%0A` +
                `*Email:* ${encodeURIComponent(email)}%0A` +
                `*Message:* ${encodeURIComponent(message)}`;

            // Open WhatsApp
            const waUrl = `https://wa.me/${phoneNumber}?text=${waMessage}`;
            window.open(waUrl, '_blank');

            // Optional: Clear form
            contactForm.reset();
        });
    }
});
