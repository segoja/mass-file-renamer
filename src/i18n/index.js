import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    buttons: {
      files: 'Files',
      folder: 'Folder',
      rename: 'Rename',
      close: 'Close',
      cancel: 'Cancel',
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
      language: 'Change language',
      files: 'Select files',
      folder: 'Select folder',
      restore: 'Restore names',
      rename: 'Apply name changes',
      tolower: 'To lower case',
      toupper: 'To upper case',
      remove: 'Find and remove text',
      replace: 'Apply to text',
      clear: 'Clear template',
      copy: 'Copy file names to clipboard',
      copied: 'Names copied to clipboard',
      close: 'Close',
      cancel: 'Cancel',
      done: 'Done!',
      yes: 'Yes',
      no: 'No',
      number: 'number',
      prefix: 'prefix',
      name: 'name',
      suffix: 'suffix',
      date: 'date',
      time: 'time',
      about: 'About/Help',
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
      filename: 'File names'
    },
    text: {
      confirmtitle: 'Confirm action',
      confirmtext: 'Are you sure you want to rename the files?',
      abouttitle: 'About',
      abouttext: {
        p1: 'Mass File Renamer',
        p2: 'Author: Javier Sevilla (segoja)',
        p3: 'License:',
        p4: 'This app is distributed under the MIT License, which means you are free to use, modify, and distribute it according to the terms of the license. For more details, check out the License file included in the app repository.',
        p5: 'GitHub Repository:',
        p6: 'Please, visit the repository to contribute, report issues, or explore the source code.'
      },
      helptitle: 'Help',
      helptext: {
        p1: 'Select the files you want to rename with the file or folder selector.',
        p2: 'Filter the files if needed and proceed to rename them.',
        p3: 'Rename files as if you were editing text in any normal text editor such as Notepad.',
        p4: 'The template system allows you to rename massive amounts of files using the same template/naming convention for all of them, so you can number them, include the date or time, add prefixes or suffixes, and so on.',
        p5: 'You can also search, replace and remove text from filenames, even allowing the use of regular expressions (regex).',
        p6: 'In addition, you can also set the file names to upper or lower case. ',
        p7: 'Once you have finished proceed to click the Rename button.',
        p8: 'To restore the original names click on the restore button next to the folder and file selection buttons.'
      },
      loading: 'Loading files...',
      renaming: 'Renaming files...',
      nofiles: 'No files selected.'
    }
  },
  es: {
    buttons: {
      files: 'Archivos',
      folder: 'Carpeta',
      rename: 'Renombrar',
      close: 'Cerrar',
      cancel: 'Cancelar',
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
      language: 'Cambiar idioma',
      files: 'Seleccionar archivos',
      folder: 'Seleccionar carpeta',
      restore: 'Restaurar nombres',
      rename: 'Aplicar cambios de nombre',
      tolower: 'Convertir a minúsculas',
      toupper: 'Convertir a mayúsculas',
      remove: 'Buscar y eliminar texto',
      replace: 'Aplicar al texto',
      clear: 'Limpiar plantilla',
      copy: 'Copiar nombres de archivo al portapapeles',
      copied: 'Nobres copiados al portapapeles',
      close: 'Cerrar',
      cancel: 'Cancelar',
      done: 'Hecho!',
      yes: 'Si',
      no: 'No',
      number: 'número',
      prefix: 'prefijo',
      name: 'nombre',
      suffix: 'sufijo',
      date: 'fecha',
      time: 'hora',
      about: 'Acerca de/Ayuda',
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
      filename: 'Nombres de archivo'
    },
    text: {
      confirmtitle: 'Confirmar acción',
      confirmtext: '¿Está seguro de que desea renombrar los archivos?',
      abouttitle: 'Acerca de',
      abouttext: {
        p1: 'Mass File Renamer',
        p2: 'Author: Javier Sevilla (segoja)',
        p3: 'Licencia:',
        p4: 'Esta aplicación se distribuye bajo la Licencia MIT, lo que significa que usted es libre de usarla, modificarla y distribuirla de acuerdo con los términos de la licencia. Para obtener más detalles, consulte el archivo de Licencia incluido en el repositorio de la aplicación.',
        p5: 'Repositorio en GitHub:',
        p6: 'Por favor, visite el repositorio para contribuir, informar problemas o explorar el código fuente.'
      },
      helptitle: 'Ayuda',
      helptext: {
        p1: 'Seleccione los archivos que desea renombrar con el selector de archivos o carpetas. ',
        p2: 'Filtre los archivos si lo necesita y proceda a renombrarlos.',
        p3: 'Renombre archivos como si estuviera editando texto en cualquier editor de texto normal como el bloc de notas.',
        p4: 'El sistema de plantillas le permite renombrar cantidades masivas de ficheros utilizando la misma plantilla/convención de nomenclatura para todos ellos, de forma que pueda numerarlos, incluir la fecha o la hora, añadir prefijos o sufijos, etc.',
        p5: 'También puede buscar, reemplazar y eliminar texto de los nombres de archivo, permitiendo incluso el uso de expresiones regulares (regex).',
        p6: 'Adicionalmente también puede poner los nombres de los archivos en mayúsculas o minúsculas.',
        p7: 'Una vez que haya terminado proceda a pulsar el botón Renombrar.',
        p8: 'Para restablecer los nombres originales proceda a pulsar el botón restaurar situado al lado de los botones de selección de carpeta y archivos.'
      },
      loading: 'Cargando archivos...',
      renaming: 'Renombrando archivos...',
      nofiles: 'No hay archivos seleccionados.'
    }
  }
}

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  allowComposition: true, // you need to specify that!
  messages
})
