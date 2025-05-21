import * as React from "react"
import { cn } from "../../lib/utils"
import { Search as SearchIcon } from "lucide-react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(({ className, onSearch, ...props }, ref) => {
  const [value, setValue] = React.useState("")

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (onSearch) {
        onSearch(value)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <div className={cn("relative flex items-center", className)}>
      <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={ref}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="pl-9"
        {...props}
      />
    </div>
  )
})
Search.displayName = "Search"

export { Input, Search }
