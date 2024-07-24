import Image from "next/image";


export default function Logo() {
  return (
    <div className="flex gap-2">
      <Image src={'logo.svg'} alt="Logo" width={40} height={40} />
      <p className="font-bold text-2xl">Itacash</p>
    </div>
  )
}