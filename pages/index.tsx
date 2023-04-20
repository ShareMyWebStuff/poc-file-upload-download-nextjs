
import { useState} from 'react'
import * as path from 'path';
import styles from '@/styles/Home.module.css'

// N - No file selected
// U - File selected and uploaded
// P - File converted and saved
// E - error selecting or converting file
type FileProcess = {
  status: 'U' | 'N' | 'P' | 'E'
  message: null | string
  filename: null | string
  fileExtension: null | string
  data: null | string
}

export default function Home() {

  const [ fileProcess, setFileProcess ] = useState<FileProcess>({
    status: 'N',
    message: null,
    filename: null,
    fileExtension: null,
    data: null
  })

  /**
   * Saves data to a file in CSV format
   * 
   * @param blob 
   * @param suggestedName 
   */
  const saveFile = async ( suggestedName: string) => {

    if ( !fileProcess.data) return;

    const blobURL = URL.createObjectURL(new Blob([fileProcess.data.replace(/\t/g, ',')]));

    const a = document.createElement('a');
    a.href = blobURL;
    a.download = suggestedName;
    a.style.display = 'none';
    document.body.append(a);

    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(blobURL);
      a.remove();
    }, 1000);

  }

  /**
   * Loads the selected file into memory
   * @param selectorFiles 
   * @returns 
   */
  const loadFile = (selectorFiles: FileList | null) => {

    if ( !selectorFiles ) return

    const reader = new FileReader ();

    // Check file is loaded
    reader.addEventListener( 'load', (event) => {
      if ( !event.target ) return
      const result = event.target.result as string;
      const fn = path.parse(selectorFiles[0].name)
      setFileProcess( prev => ({...prev, data: result, message: 'File successfully loaded', filename: fn.name, fileExtension: fn.ext, status: 'U' }))
    })

    reader.readAsText(selectorFiles[0])
  }

  return (

    <main className={styles.main}>
      <div className={styles.description}>
        <form className={styles.form}>
          <h1>Select File</h1>
          <input className={styles.rowGap} type="file" multiple={false} onChange={evt => loadFile(evt.target.files)} accept=".txt" />
          <div className={styles.btnBar}>
            <button className={ styles.btn + (fileProcess.status !== 'U' ? ' ' + styles.hide : '')} onClick={() => saveFile(fileProcess.filename + '.csv')}>Save File</button>
            <button className={ styles.btn + (['U','P','E'].includes(fileProcess.status) ? '' : ' ' + styles.hide )} onClick={e => setFileProcess({ status: 'N', message: null, data: null, filename: null, fileExtension: null })}>Reset</button>
          </div>
          <div className={styles.displayMessage}>
            <p>{fileProcess.message}</p>
          </div>
        </form>
      </div>
    </main>
  )
}