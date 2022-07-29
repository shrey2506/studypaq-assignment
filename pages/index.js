import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ImageGallery from './ImageGallery/ImageGallery'

export default function Home() {
  return (
    <div className={styles.container}>
      <ImageGallery />
    </div>
  )
}
