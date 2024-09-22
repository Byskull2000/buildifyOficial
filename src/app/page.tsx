import { Poppins } from 'next/font/google';

{/*Cargar fuente global*/}
const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
});
export default function Home() {
  return (
    <div className={poppins.className}>
      <h1>PAGINA DE INICIO: page.tsx</h1>
    </div>
  );
}
