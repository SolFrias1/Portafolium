# Portafolio · Victoria Sol Frías

Archivo digital y portafolio de diseño industrial, indumentaria experimental e interacción física-digital de **Victoria Sol Frías** (Universidad Diego Portales, Santiago de Chile).

El sitio articula dos ámbitos que suelen desarrollarse por separado: el **hacer matérico** (patronaje, superficies textiles, maquetado estructural en madera y acero) y la **experimentación computacional** trabajada en el curso *Diseño y Programación de Plataformas Interactivas* (DPPI).

---

## Parte 1 · Conceptos técnicos aplicados

### HTML → Estructura
> Es el lenguaje que construye una página web; es el esqueleto de un sitio: organizando y sosteniendo los elementos que aparecen como: títulos, textos, botones, enlaces, etc. Da un orden al contenido y permite que el navegador entienda qué elementos existen y cómo es que están organizados.

Fragmento propio de [index.html](index.html) que organiza la cabecera accesible y el enlace de navegación hacia cada sección del sitio:

```html
<header id="siteHeader" class="site-header">
  <div class="wrap nav-inner">
    <a href="index.html" class="nav-brand">Victoria Sol Frías</a>
    <nav class="nav-links" aria-label="Navegación principal">
      <a href="#haloRoot" class="nav-link" aria-current="page">Inicio</a>
      <a href="#about-me" class="nav-link">About</a>
      <a href="#proyectos-ppi" class="nav-link">Interacción</a>
      <a href="#indumentaria" class="nav-link">Indumentaria</a>
      <a href="#industrial" class="nav-link">Industrial</a>
    </nav>
  </div>
</header>
```

---

### CSS → Apariencia
> Encargada de darle forma visual; permite definir colores, tipografías, tamaños, y cómo se distribuyen los elementos en la pantalla. Transforma una estructura básica en una experiencia visual, definiendo identidad y adaptación a distintos dispositivos.

Fragmento propio de [css/tokens.css](css/tokens.css) donde declaro las tipografías locales y la paleta cromática que colorea cada sección del portafolio:

```css
@font-face {
  font-family: 'Galgo';
  src: url('../fonts/Galgo.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

:root {
  --burgundy: #5A1D22;
  --burgundy-deep: #490B0C;
  --cerulean: #A4BCD4;
  --paper: #F4EFEB;
  --ink: #1D120E;
}
```

---

### JavaScript → Dr. Frankenstein
> Permite que una página web deje de ser solamente algo que vemos y se convierta en algo con lo que podemos interactuar. Hace posible agregar movimiento, animaciones, y cambios en el contenido. Hacer clic en un botón o mover el cursor según lo que hacemos; es JavaScript quien puede estar detrás de ese comportamiento. Es lo que permite que la página responda y sucedan cosas.

Fragmento propio de [js/main.js](js/main.js) que detecta cuándo el usuario baja del Hero 3D para revelar suavemente la cabecera superior y observa la entrada de imágenes y títulos:

```js
function updateStickyHeader() {
  if (!siteHeader || !haloRoot) return;
  const pastHero = window.scrollY > haloRoot.offsetHeight * 0.72;
  siteHeader.classList.toggle('is-sticky-visible', pastHero);
}
```

---

### MQTT → Vocero / Comunicación / Dealer
> Es un protocolo o red que permite que distintos dispositivos o programas intercambien información a través de mensajes. Funciona mediante un sistema de publicación y suscripción: un dispositivo envía un mensaje a un canal (publica) y otros dispositivos que están conectados a ese mismo canal pueden recibirlo (se suscriben). Especialmente útil cuando queremos conectar elementos que no necesariamente están en el mismo dispositivo. Por ejemplo: enviar información desde un teléfono hacia un computador para generar una respuesta visual en tiempo real.

Fragmento real de mi ejercicio **T07 · UMWELT** (`public/tacto.js`) donde el teléfono móvil y la escena en el computador se comunican por salas MQTT sobre WebSockets:

```js
// Broker MQTT sobre WebSockets usado en UMWELT (tacto.js)
const PUBLIC_BROKER = 'wss://broker.emqx.io:8084/mqtt';

// Canales publicados desde el teléfono hacia la experiencia:
// tacto/<sala>/<dispositivo>/touch   -> {t, n, ar, p:[{i,x,y,f,d}]}
// tacto/<sala>/<dispositivo>/motion  -> {t, a:[alfa,beta,gamma], r:[x,y,z]}
```

---

### Otras tecnologías integradas en el semestre y en este portafolio
- **Three.js / WebGL & Shaders GLSL**: adaptación sin framework del componente 3D *Halo Ring Hero* en [js/halo-hero.js](js/halo-hero.js) y simulación térmica + aberración cromática en *T05 · Crisol Audioreactivo*.
- **Web Audio API**: análisis espectral FFT en tiempo real (*Crisol*), mezcla reactiva de 8 capas (*UMWELT*) y espacialización `StereoPannerNode` + convolución (*T06 · Domesticadas*).
- **MediaPipe Pose + Hands & Python / OpenCV**: contraste entre lectura anatómica persistente y diferencia de cuadros efímera en *T03 · Dos Realidades*.
- **GitHub Pages**: despliegue directo de archivos estáticos sin compiladores ni claves expuestas en el código.

---

## Parte 2 · Reflexión del semestre

Este recopilado terminó convirtiéndose en una cantidad casi interminable de cuestionamientos. Fue un proceso entretenido, aunque también bastante agobiante de organizar. El curso de plataformas se transformó en un ejercicio constante de experimentación, muchas veces sin tener muy claro hacia dónde iba, avanzando entre errores, pruebas y descubrimientos.

Muchas veces el proceso comenzó desde la curiosidad: probar una herramienta, modificar algo, observar qué sucedía y descubrir posibilidades que no había considerado al principio.

Uno de los mayores desafíos fue enfrentar herramientas que prácticamente desconocía. En ocasiones, ni siquiera tenía del todo claro qué estaba intentando hacer o cómo llegar al resultado que imaginaba. Hubo mucho de prueba y error, de revisar código, buscar referencias y volver a intentarlo. Aprendí que una parte importante del proceso está en entender qué está sucediendo y no solamente en conseguir que algo funcione.

Durante el semestre también utilicé herramientas de inteligencia artificial como apoyo en distintas etapas del trabajo. Principalmente, para resolver dudas técnicas, comprender fragmentos de código, explorar alternativas, TDA, detectar errores y ordenar ideas que todavía estaban bastante difusas, y sobre todo en la generación de códigos largos, que se escriben casi en chino y jeroglíficos.

A medida que fui entendiendo cómo formular instrucciones más específicas (prompts), las posibilidades de estas herramientas comenzaron a sorprenderme. Por primera vez pude acercarme a la creación de páginas web, trabajar con código y explorar herramientas que antes sentía bastante lejanas. También pude reconocer sus limitaciones y era necesario revisar, probar y adaptar cada resultado a las necesidades de los proyectos.

Y, por supuesto, estuvieron los problemas al momento de implementar y publicar los ejercicios en distintas plataformas. Entre tantos cambios, pruebas e ideas nuevas, algunas cosas dejaban de funcionar después de una actualización o modificación inesperada. Más de una vez terminé haciendo un reinicio, descartando ideas y volviendo a empezar desde cero.

En teoría, todo terminó funcionando. Pero si algo aprendí es que, por mucho que uno se esfuerce, a veces las cosas simplemente fallan. Y sí, fue bastante deprimente en algunos momentos.

Con todo y ese tono un poco amargo, puedo decir sin dudas… que me gustó. Fue un ritmo exigente, en el que tuve dificultades para coordinarme, desarrollar ideas y encontrar claridad entre tantas herramientas y posibilidades. Sin embargo, seguí intentándolo; quizás no siempre de la mejor manera ni dentro de los tiempos esperados, pero seguí. Y aquí me encuentro, con una cantidad de aprendizajes, errores y experiencias que probablemente no habría descubierto de otra forma, sin paralizarme.

Finalmente, vino el desarrollar este portafolio, el cual sirvió como un ejercicio para mirar el semestre en conjunto. Y donde más que reunir trabajos terminados, me permitió reconocer intereses que se repiten entre ellos y encontrar relaciones entre disciplinas que, a primera vista, parecían bastante diferentes.

A lo largo del proceso pude acercarme a distintas formas de cuestionar y hacer diseño, descubrir nuevos intereses y enfrentar desafíos que me llevaron a salir de mis propias ideas iniciales.

Me quedo con la curiosidad de seguir explorando, cuestionando y encontrando nuevas formas de crear; con intereses que comienzan a tomar forma y con nuevas maneras de abordar una idea.

Este portafolio es una mirada en construcción. De mí para ti.

---

## Arquitectura del repositorio

```text
.
├── .gitignore                # Excluye respaldos pesados (_recursos_originales/, *.zip, *.mov, .DS_Store)
├── .nojekyll                 # Sirve los archivos estáticos en GitHub Pages sin Jekyll
├── README.md                 # Documentación de cierre, conceptos técnicos y reflexión
├── index.html                # Landing principal (Halo Ring 3D + bandas cromáticas + contacto)
├── about.html                # Perfil, trayectoria UDP, herramientas, pintura y contacto
├── work/
│   ├── index.html            # Índice general de los 7 proyectos con filtro por disciplina
│   ├── umwelt.html           # T07 · UMWELT: El Jardín de Frankenstein (DPPI)
│   ├── domesticadas.html     # T06 · Domesticadas: La Ilusión de la Libertad (DPPI)
│   ├── dos-realidades.html   # T03 · Dos Realidades: Estructura y Acontecimiento (DPPI)
│   ├── crisol-audioreactivo.html # T05 · Crisol Audioreactivo: Piedad (DPPI + video 9:16)
│   ├── bivalvia.html         # 09 · BIVALVIA: Superficies Textiles P/V 2025
│   ├── vestido-yara.html     # 04 · Vestido Yara: Taller de Moda Sostenible
│   └── taller-local.html     # 02 · Taller Local: Mobiliario Postmob (1:14)
├── css/
│   ├── tokens.css            # Tipografías locales y sistema cromático
│   ├── base.css              # Reset accesible, navegación fija/móvil y footer
│   ├── landing.css           # Hero 3D, sutura PORTAFOLIO, bandas de color y zoom 1s
│   └── subpages.css          # Temas cromáticos, cuaderno abierto técnico y galerías
├── js/
│   ├── halo-hero.js          # Port vanilla Three.js de Halo Ring Hero (arrastrable + odómetro)
│   ├── projects-data.js      # Catálogo de los 7 proyectos
│   ├── main.js               # Renderizado inicial, canvas Domesticadas, reveal y parallax
│   └── subpages.js           # Filtros, libro interactivo con scroll vertical y lightbox
├── fonts/
│   ├── Galgo.ttf             # Display condensada (Open Source · @bojjoe)
│   ├── Unique-Regular.otf    # Display editorial (Commercial Use Allowed)
│   └── Unique-Medium.otf
├── images/
│   ├── yo.png                # Retrato de Victoria Sol Frías
│   ├── sol-frias-firma.png   # Firma manuscrita
│   └── projects/             # 31 fotografías editoriales, fotogramas, láminas curatoriales y planimetrías
└── videos/
    └── crisol-loop.webm      # Bucle vertical 9:16 de Crisol Audioreactivo
```

### Ejecución local y publicación en GitHub Pages
```bash
# Vista previa local (requiere servidor HTTP por ES Modules)
python3 -m http.server 8090
```

Para publicar en GitHub Pages: verificar con `git status` que `_recursos_originales/` no se incluya (ya está en `.gitignore`), subir a GitHub (`github.com/SolFrias1/DPPI` o `portafolio`) y activar **Settings → Pages → Deploy from a branch (`main` / `root`)**.

---

## Créditos y referencias

- **Autoría:** Victoria Sol Frías — Diseño con mención en Diseño Industrial, Universidad Diego Portales (2024–2026).
- **Contacto:** `vsfrias.go@gmail.com` · Instagram [`@portf.frias`](https://instagram.com/portf.frias) · GitHub [`github.com/SolFrias1`](https://github.com/SolFrias1).
- **Componente 3D adaptado en Landing:** [Halo Ring Hero — 21st.dev (@kedhareswer)](https://21st.dev/@kedhareswer/components/halo-ring-hero), adaptado a Three.js vanilla sin framework y gráfica propia.
- **Recursos sonoros:** [FreeSound](https://freesound.org/) — Recursos sonoros utilizados en experiencias interactivas.
- **Referentes, herramientas y técnicas exploradas:**
  - [2xA Studio](https://2xa.studio/)
  - [21st.dev](https://21st.dev/)
  - [Aceternity UI](https://ui.aceternity.com/)
  - [Awwwards](https://www.awwwards.com/)
  - Parallax Scrolling
- **Referencia colaborativa en *Dos Realidades* (T03 DPPI):** Arquitectura base Pose/OpenCV documentada por Felipe Roa R. en el repositorio original.
- **Tipografías:**
  - *Galgo Condensed* — Open Source por Giulia Boggio (`@bojjoe`).
  - *Unique* — Regular & Medium (*Commercial Use Allowed*).
  - *Cormorant Garamond*, *IBM Plex Sans* e *IBM Plex Mono* — vía Google Fonts.
