import * as React from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * MONOLITHIC Select component (Legacy compatibility)
 */
export function Select({ 
    value, 
    onChange, 
    onValueChange, // Support both prop names
    options = [], 
    placeholder = "Select an option", 
    label,
    className,
    upward = false,
    children // Support children for modular usage
}) {
    // If children are provided, this is the modular shadcn-style usage
    if (children) {
        return (
            <SelectRoot value={value} onValueChange={onValueChange || onChange}>
                {children}
            </SelectRoot>
        )
    }

    // Otherwise, it's the legacy monolithic usage
    const selectedOption = options.find(opt => opt.value?.toString() === value?.toString())
    const internalOnChange = onValueChange || onChange

    return (
        <div className={cn("w-full relative", className)}>
            {label && (
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <Listbox value={value} onChange={internalOnChange}>
                <div className="relative">
                    <Listbox.Button className={cn(
                        "relative w-full cursor-pointer h-11 rounded-sm bg-white py-2 pl-4 pr-10 text-left border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 sm:text-sm transition-all hover:bg-gray-50/50",
                        className && className.includes('h-') ? "" : "h-11"
                    )}>
                        <span className={cn("block truncate font-medium", !selectedOption && "text-gray-400")}>
                            {selectedOption ? selectedOption.label : placeholder}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                            <ChevronDown
                                className="h-4 w-4 text-gray-400"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={React.Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className={cn(
                            "absolute right-0 z-[100] max-h-60 w-full min-w-[70px] overflow-auto rounded-sm bg-white py-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-100",
                            upward ? "bottom-full mb-2" : "mt-1.5"
                        )}>
                            {options.map((option, idx) => (
                                <Listbox.Option
                                    key={idx}
                                    className={({ active, selected }) =>
                                        `relative cursor-pointer select-none py-1.5 px-3 transition-colors ${
                                            active || selected ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50"
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => (
                                        <div className="flex items-center justify-start px-1">
                                            <span className={cn("block truncate text-[13px]", selected ? "font-bold" : "font-medium")}>
                                                {option.label}
                                            </span>
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    )
}

/**
 * MODULAR Select components (shadcn-style)
 */

const SelectContext = React.createContext(null)

function SelectRoot({ children, value, onValueChange }) {
    return (
        <SelectContext.Provider value={{ value, onValueChange }}>
            <Listbox value={value} onChange={onValueChange}>
                <div className="relative w-full">
                    {children}
                </div>
            </Listbox>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <Listbox.Button
        ref={ref}
        className={cn(
            "relative flex w-full cursor-pointer h-11 items-center justify-between rounded-sm bg-white px-4 py-2 text-left border border-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 sm:text-sm transition-all hover:bg-gray-50/50 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        {children}
        <ChevronDown className="h-4 w-4 text-gray-400" />
    </Listbox.Button>
))
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = ({ placeholder, className, children }) => {
    const { value } = React.useContext(SelectContext)
    return (
        <span className={cn("block truncate font-medium", !value && "text-gray-400", className)}>
            {children || value || placeholder}
        </span>
    )
}

export const SelectContent = ({ className, children, upward = false, position = "popper" }) => (
    <Transition
        as={React.Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        <Listbox.Options
            className={cn(
                "absolute z-[100] max-h-60 w-full min-w-[8rem] overflow-auto rounded-sm bg-white py-1 text-base shadow-2xl ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-100",
                upward ? "bottom-full mb-1.5" : "mt-1.5",
                className
            )}
        >
            {children}
        </Listbox.Options>
    </Transition>
)

export const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => (
    <Listbox.Option
        ref={ref}
        value={value}
        className={({ active, selected }) =>
            cn(
                "relative flex w-full cursor-pointer select-none items-center py-2 px-3 transition-colors outline-none",
                active || selected ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-700 hover:bg-gray-50",
                className
            )
        }
        {...props}
    >
        {({ selected }) => (
            <>
                <span className={cn("block truncate text-[13px] ml-5", selected ? "font-bold" : "font-medium")}>
                    {children}
                </span>
                {selected && (
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                    </span>
                )}
            </>
        )}
    </Listbox.Option>
))
SelectItem.displayName = "SelectItem"

export const SelectGroup = ({ children, className }) => (
    <div className={cn("px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}>
        {children}
    </div>
)
