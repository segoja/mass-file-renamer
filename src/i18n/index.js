import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    buttons: {
      files: 'Files',
      folder: 'Folder',
      rename: 'Rename',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      number: 'number',
      prefix: 'prefix',
      name: 'name',
      suffix: 'suffix',
      date: 'date',
      time: 'time'
    },
    titles: {
      files: 'Select files',
      folder: 'Select folder',
      restore: 'Restore names',
      rename: 'Apply name changes',
      tolower: 'To lower case',
      toupper: 'To upper case',
      clear: 'Clear template',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      number: 'number',
      prefix: 'prefix',
      name: 'name',
      suffix: 'suffix',
      date: 'date',
      time: 'time',
      about: 'Help/About',
      mode: 'Light/Dark mode',
      wipe: 'Empty file list',
      del: 'Exclude file'
    },
    labels: {
      filter: 'Filter',
      elements: 'Elements:',
      template: 'Template:',
      prefix: 'Prefix',
      suffix: 'Suffix',
      find: 'Find',
      replace: 'Replace',
      remove: 'Remove',
      filename: 'File name'
    },
    text: {
      confirmtitle: 'Confirm action',
      confirmtext: 'Are you sure you want to rename the files?',
      abouttitle: 'About/Help',
      abouttext: {
        p1: 'Because of what I do for a living I spend a lot of time renaming files. Tired of not having a tool to fit my needs I decided to make this app using the latest Vue and Tauri versions.',
        p2: 'The idea was to make editing files as simple as possible, treating filenames like you would do on any regular text editor like notepad.',
        p3: 'I created a template system so you can rename massive amounts of files using the same naming template/convention for all of them, so you can number them, include the date or time, add prefix or suffix, etc.',
        p4: 'You can also find, replace and remove fragments of the file names, allowing even the use of regular expressions (regex).',
        p5: 'Additionally you can also upper case or lowercase file names.'
      },
      loading: 'Loading files...',
      renaming: 'Renaming files...'
    }
  },
  es: {
    buttons: {
      files: 'Archivos',
      folder: 'Carpeta',
      rename: 'Renombrar',
      close: 'Cerrar',
      yes: 'Si',
      no: 'No',
      number: 'número',
      prefix: 'prefijo',
      name: 'nombre',
      suffix: 'sufijo',
      date: 'fecha',
      time: 'hora'
    },
    titles: {
      files: 'Seleccionar archivos',
      folder: 'Seleccionar carpeta',
      restore: 'Restaurar nombres',
      rename: 'Aplicar cambios de nombre',
      tolower: 'Convertir a minúsculas',
      toupper: 'Convertir a mayúsculas',
      clear: 'Limpiar plantilla',
      close: 'Cerrar',
      yes: 'Si',
      no: 'No',
      number: 'número',
      prefix: 'prefijo',
      name: 'nombre',
      suffix: 'sufijo',
      date: 'fecha',
      time: 'hora',
      about: 'Ayuda/Acerca de',
      mode: 'Modo claro/oscuro',
      wipe: 'Vaciar lista de archivos',
      del: 'Excluir archivo'
    },
    labels: {
      filter: 'Filtrar',
      elements: 'Elementos:',
      template: 'Plantilla:',
      prefix: 'Prefijo',
      suffix: 'Sufijo',
      find: 'Buscar',
      replace: 'Reemplazar',
      remove: 'Eliminar',
      filename: 'Nombre de archivo'
    },
    text: {
      confirmtitle: 'Confirmar acción',
      confirmtext: '¿Está seguro de que desea renombrar los archivos?',
      abouttitle: 'Acerca de/Ayuda',
      abouttext: {
        p1: 'Debido a lo que hago para ganarme la vida, paso mucho tiempo renombrando archivos. Cansado de no tener una herramienta que se ajuste a mis necesidades, decidí crear esta aplicación utilizando las últimas versiones de Vue y Tauri.',
        p2: 'La idea era hacer la edición de archivos lo más simple posible, tratando los nombres de archivo como lo harías en cualquier editor de texto común como el bloc de notas.',
        p3: 'Creé un sistema de plantillas para que puedas renombrar grandes cantidades de archivos utilizando la misma plantilla o convención de nombres para todos ellos, de manera que puedas numerarlos, incluir la fecha o la hora, agregar un prefijo o sufijo, etc.',
        p4: 'También puedes buscar, reemplazar y eliminar fragmentos de los nombres de archivo, incluso utilizando expresiones regulares (regex).',
        p5: 'Además, también puedes convertir los nombres de archivo a minúsculas o mayúsculas.'
      },
      loading: 'Cargando archivos...',
      renaming: 'Renombrando archivos...'
    }
  }
}

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages
})
