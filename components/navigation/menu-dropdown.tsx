import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { CreditCard, ListMinus, Settings2 } from "lucide-react"
import Link from "next/link"


export default function MenuDropdown(){
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Settings2 className="size-5 text-gray-500"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel></DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <Link href={'/dashboard/categories'}>
            <DropdownMenuItem className="gap-x-2">
              <ListMinus className="size-4 text-gray-500" />
              <span>Categorias</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-x-2">
            <CreditCard className="size-4 text-gray-500" />
            <span>Assinatura</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}