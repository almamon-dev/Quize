import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext({ 
    activeTab: "", 
    setActiveTab: () => {},
    onValueChange: () => {}
})

const Tabs = ({ children, defaultValue, onValueChange, className }) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue)
    
    const handleTabChange = (value) => {
        setActiveTab(value)
        if (onValueChange) onValueChange(value)
    }

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
            <div className={cn("w-full overflow-hidden", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

const TabsList = ({ children, className }) => {
    return (
        <div className={cn("flex border-b border-gray-200 h-12 items-end", className)}>
            {children}
        </div>
    )
}

const TabsTrigger = ({ value, label, count, className }) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext)
    const isActive = activeTab === value
    
    return (
        <button
            type="button"
            onClick={() => setActiveTab(value)}
            className={cn(
                "px-4 py-3 text-sm font-medium transition-all relative outline-none focus:outline-none",
                isActive 
                    ? "text-blue-600" 
                    : "text-gray-500 hover:text-gray-700",
                className
            )}
        >
            <span className="flex items-center gap-1.5 whitespace-nowrap">
                {label}
                {count !== undefined && (
                    <span className="text-gray-400 font-normal">({count})</span>
                )}
            </span>
            {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-in fade-in slide-in-from-bottom-1 duration-200" />
            )}
        </button>
    )
}

const TabsContent = ({ value, children, className }) => {
    const { activeTab } = React.useContext(TabsContext)
    if (activeTab !== value) return null
    return (
        <div className={cn("mt-4", className)}>
            {children}
        </div>
    )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
