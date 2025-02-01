import { AAKAForm } from "@/components/Aakaform"
import logo from '../../public/imgaaka.png'

export default function Home() {
  return (
    <main className="container mx-auto py-10 bg-secondary min-h-screen">
      <div className="flex items-center justify-center gap-5 text-2xl sm:text-5xl text-center mb-6 text-primary italic font-sans text-black font-thin ">
        <div>
          <img className="w-10 sm:w-16" src={logo.src} alt="" />
        </div>
        <div>
          Aaka-Official
        </div>
      </div>
      <AAKAForm />
    </main>
  )
}

