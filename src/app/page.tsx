import { AAKAForm } from "@/components/Aakaform"

export default function Home() {
  return (
    <main className="container mx-auto py-10 bg-secondary min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-primary">AAKA Company Registration Form</h1>
      <AAKAForm />
    </main>
  )
}

