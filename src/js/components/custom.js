import { jarallax } from 'jarallax'

//////////////////////////TRADUCCIONES/////////////////////

let translations = {}

function loadTranslations(lang) {
  fetch(`/assets/json/${lang}.json`) // Ajusta la ruta según sea necesario
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then((data) => {
      translations = data // Almacena las traducciones
      setLanguage(lang) // Aplica las traducciones al cargar
      document.documentElement.lang = lang // Actualiza el atributo lang del HTML
      updateLanguageButton(lang) // Actualiza el texto del botón de idioma
    })
    .catch((error) => console.error('Error loading translations:', error))
}

// Función para detectar el idioma del navegador
function detectLanguage() {
  const storedLang = localStorage.getItem('lang') // Intenta obtener el idioma almacenado
  if (storedLang) {
    return storedLang // Si hay un idioma almacenado, lo retorna
  }
  const userLang = navigator.language // Obtiene el idioma del navegador
  return userLang.startsWith('es') ? 'es' : 'en' // Devuelve 'es' si comienza con 'es', de lo contrario 'en'
}

// Cargar las traducciones basadas en el idioma del navegador
const defaultLang = detectLanguage()
loadTranslations(defaultLang) // Carga según el idioma detectado

// Función para aplicar las traducciones al HTML
function setLanguage(lang) {
  if (!translations) {
    console.error(`No translations found for language: ${lang}`)
    return
  }

  // Actualizar las etiquetas meta
  const metaTranslations = translations.meta
  if (metaTranslations) {
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', metaTranslations.description)
    document
      .querySelector('meta[name="keywords"]')
      .setAttribute('content', metaTranslations.keywords)
    document
      .querySelector('meta[name="author"]')
      .setAttribute('content', metaTranslations.author)
  }

  document.querySelectorAll('[data-key]').forEach((element) => {
    const key = element.getAttribute('data-key').split('.')
    let translation = translations

    key.forEach((k) => {
      if (translation) {
        translation = translation[k]
      } else {
        console.warn(`No translation found for key: ${key.join('.')}`)
      }
    })

    if (translation !== undefined) {
      if (element.tagName === 'META') {
        element.setAttribute('content', translation) // Para etiquetas meta
      } else {
        element.innerHTML = translation // Para otros elementos
      }
    } else {
      console.warn(`No translation found for key: ${key.join('.')}`)
    }
  })
}

// Maneja el clic en el botón de idioma
document
  .getElementById('languageButton')
  .addEventListener('click', function () {
    const currentLang = document.documentElement.lang // Obtiene el idioma actual
    const newLang = currentLang === 'es' ? 'en' : 'es' // Cambia entre idiomas
    localStorage.setItem('lang', newLang) // Almacena el nuevo idioma en localStorage
    loadTranslations(newLang) // Carga las traducciones según el nuevo idioma
  })

// Función para actualizar el texto del botón de idioma
function updateLanguageButton(lang) {
  const button = document.getElementById('languageButton')
  const span = button.querySelector('span') // Selecciona el <span> dentro del botón
  span.innerHTML =
    lang === 'es'
      ? 'En<span class="d-none d-md-inline">glish</span>'
      : 'Es<span class="d-none d-md-inline">pañol</span>' // Cambia el texto según el idioma
}

////////////////////////////////////////////////////////////////

// HEADER
const header = document.querySelector('header.navbar')
const mainSection = document.querySelector('#main-section') // Sección principal
const footerSection = document.querySelector('#work-together') // Última sección (footer)
const scrollThreshold1 = 100 // Umbral para cuando el elemento toque la parte superior del viewport
const scrollThreshold2 = 30 // Umbral para cuando el elemento toque la parte superior del viewport

if (window.location.pathname.startsWith('/project/')) {
  window.addEventListener('scroll', updateHeaderClasses)
  window.addEventListener('resize', updateHeaderClasses)
  updateHeaderClasses()
}

function updateHeaderClasses() {
  let mainPosition = mainSection?.getBoundingClientRect().top || null
  let footerPosition = footerSection?.getBoundingClientRect().top || null

  // EN PANTALLAS MAYORES A 576PX Y SIN data-bs-theme = dark
  if (window.innerWidth >= 576) {
    header.classList.remove('bg-light', 'border-bottom')
    header.classList.add('bg-transparent')
    if (header.getAttribute('data-initial-bs-theme') === 'dark') {
      header.setAttribute('data-bs-theme', 'dark')
    } else {
      header.setAttribute('data-bs-theme', 'light')
    }
    // Si hemos llegado a la sección #main-section, pero aún no al footer
    if (
      mainPosition !== null &&
      mainPosition <= scrollThreshold1 &&
      (footerPosition === null || footerPosition > scrollThreshold2)
    ) {
      header.setAttribute('data-bs-theme', 'light')
    } else {
      if (header.getAttribute('data-initial-bs-theme') === 'dark') {
        header.setAttribute('data-bs-theme', 'dark')
      } else {
        header.setAttribute('data-bs-theme', 'light')
      }
    }

    if (footerPosition !== null && footerPosition <= scrollThreshold2) {
      if (header.getAttribute('data-initial-bs-theme') === 'light') {
        header.setAttribute('data-bs-theme', 'dark')
        const buttons = document.querySelectorAll('.btn-outline-dark') // Ajusta el selector si es necesario
        buttons.forEach((button) => button.classList.remove('text-black'))
      }
    }
  } else {
    // EN PANTALLAS MENORES A 576PX
    if (mainPosition !== null && mainPosition <= scrollThreshold1) {
      // Si hemos llegado a la sección #main-section
      header.setAttribute('data-bs-theme', 'light') // Botones negros
      header.classList.remove('bg-transparent')
      header.classList.add('bg-light', 'border-bottom')
    } else {
      // Si estamos por encima de la sección #main-section o mainPosition es null
      if (header.getAttribute('data-initial-bs-theme') === 'light') {
        header.setAttribute('data-bs-theme', 'light') // Cambia 'dark' a 'light'
      } else {
        header.setAttribute('data-bs-theme', 'dark') // Cambia 'dark' a 'light'
      }
      header.classList.remove('bg-light', 'border-bottom')
      header.classList.add('bg-transparent')
    }
  }
}

const rotateTarget = document.getElementById('rotate-target')
const innerImages = document.querySelectorAll('.inner-image')

function updateJarallaxSpeed() {
  const jarallaxElement = document.getElementById('main-hero-img')

  // Verificar si el elemento jarallax existe
  if (window.location.pathname.startsWith('/project/') && !jarallaxElement) {
    console.error('Jarallax element not found')
    return
  }

  if (window.location.pathname.startsWith('/project/')) {
    // Verificar el tamaño de la pantalla y ajustar el valor de data-speed
    if (window.innerWidth < 768) {
      jarallaxElement.setAttribute('data-speed', '-0.2') // Para pantallas pequeñas (móviles)
    } else {
      jarallaxElement.setAttribute('data-speed', '0.2') // Para pantallas grandes (desktops)
    }
    // Destruir la instancia existente de jarallax para reiniciarla con el nuevo valor
    jarallax(jarallaxElement, 'destroy') // Destruye la instancia actual
    jarallax(jarallaxElement) // Reinicializa jarallax con el nuevo atributo data-speed
  }
}

function applyTransformations() {
  if (
    window.location.pathname.endsWith('kikoto.html') ||
    window.location.pathname.startsWith('/project/')
  ) {
    // Obtener la cantidad de scroll vertical (lo lejos que estás de la parte superior de la página)
    const scrollY = window.scrollY

    // Calcular la rotación basada en la cantidad de scroll (ajusta el valor de multiplicación según el efecto que quieras)
    const rotation = scrollY * 0.005 // Ajusta este valor para un efecto más o menos pronunciado
    const scale = scrollY * 0.0005 // Ajusta este valor para un efecto más o menos pronunciado
    const translate = scrollY * 0.005 // Ajusta este valor para un efecto más o menos pronunciado

    // Aplicar la rotación al div
    rotateTarget.style.transform = `rotate(${rotation}deg) scale(${1 - scale})`

    // Aplicar transformaciones a cada imagen
    innerImages.forEach(function (image) {
      image.style.transform = `rotate(${-rotation}deg) scale(${
        1 + scale
      }) translateX(-${translate * 7}px)`
    })
  }
  updateJarallaxSpeed()
}

// Ejecutar transformaciones en el evento de scroll
window.addEventListener('scroll', applyTransformations)
window.addEventListener('resize', applyTransformations)

// Ejecutar transformaciones en la primera carga de página
applyTransformations()

// Comportamiento para los vídeos
document.addEventListener('DOMContentLoaded', function () {
  function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }

  const isMobile = isMobileDevice()

  // Seleccionamos todos los contenedores de video
  const videoContainers = document.querySelectorAll('.video-container')

  videoContainers.forEach(function (container) {
    const video = container.querySelector('.responsive-video')
    const poster = container.querySelector('.poster-image')
    const playButton = container.querySelector('.play-button')
    if (isMobile) {
      // Removemos el elemento de video para evitar la carga
      video.parentNode.removeChild(video)
      // Mostramos la imagen de póster
      poster.style.display = 'flex'
      poster.style.width = '100%'
      if (playButton) {
        playButton.addEventListener('click', function (event) {
          event.preventDefault()
          const videoSrc = playButton.getAttribute('href')
          if (videoSrc) {
            video.play()
          }
        })
      }
    } else {
      //  Ocultamos el botón
      if (playButton && playButton.parentElement) {
        playButton.parentElement.remove()
      }
      // Añadimos dinámicamente el elemento source
      const source = document.createElement('source')
      source.src = video.getAttribute('data-video')
      source.type = 'video/mp4' // Ajusta el tipo si usas otro formato
      video.setAttribute('class', 'responsive-video')
      video.appendChild(source)
      // Removemos la imagen de póster
      poster.parentNode.removeChild(poster)
    }
  })

  //   Para la section HERO, aplicar diferente propiedad de height según el tipo de dispositivo
  const heroSections = document.querySelectorAll('.hero-section')

  if (isMobile) {
    heroSections.forEach((section) => {
      section.classList.add('mobile')
      section.classList.remove('min-vh-100')
    })
  } else {
    heroSections.forEach((section) => {
      section.classList.add('desktop')
      section.classList.add('min-vh-100')
    })
  }
})
