import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              }
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <div
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              }
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        className="group peer hidden md:block text-sidebar-foreground"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* This is what handles the sidebar gap on desktop */}
        <div
          className={cn(
            "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
            "group-data-[collapsible=offcanvas]:w-0",
            "group-data-[side=right]:rotate-180",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
          )}
        />
        <div
          className={cn(
            "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            // Adjust the padding for floating and inset variants.
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col overflow-hidden bg-sidebar",
              // Adjust the border radius for floating and inset variants.
              (variant === "floating" || variant === "inset") && "rounded-lg",
              variant === "inset" && "border"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const sidebarToggleVariants = cva(
  "absolute z-20 flex size-8 items-center justify-center rounded-full bg-sidebar-muted text-sidebar-muted-foreground transition-all hover:bg-sidebar-muted/90",
  {
    variants: {
      side: {
        left: "right-0 translate-x-1/2",
        right: "left-0 -translate-x-1/2",
      },
    },
    defaultVariants: {
      side: "left",
    },
  }
)

const SidebarToggle = React.forwardRef(
  (
    {
      side,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { state, toggleSidebar, isMobile } = useSidebar()
    const Icon = children ? Slot : PanelLeft

    if (isMobile) {
      return null
    }

    return (
      <Button
        ref={ref}
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className={cn(
          "peer-data-[collapsible=none]:hidden", // Hide if not collapsible.
          sidebarToggleVariants({ side }),
          className
        )}
        {...props}
      >
        <Icon
          className={cn(
            "size-4 shrink-0 transition-transform duration-200 ease-in-out",
            state === "expanded" && side === "left" && "rotate-180",
            state === "expanded" && side === "right" && "rotate-180"
          )}
        >
          {children}
        </Icon>
      </Button>
    )
  }
)
SidebarToggle.displayName = "SidebarToggle"

const SidebarHeader = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex h-12 shrink-0 items-center justify-between gap-2 border-b px-2",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarTitle = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn(
          "min-w-0 flex-1 truncate text-lg font-semibold",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarTitle.displayName = "SidebarTitle"

const SidebarSearch = React.forwardRef(
  (
    {
      className,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar()
    return (
      <div
        className={cn(
          "group/search relative shrink-0",
          state === "collapsed" && "pointer-events-none"
        )}
      >
        <Input
          ref={ref}
          className={cn(
            "bg-sidebar-muted transition-all duration-200 ease-in-out",
            state === "collapsed" && "w-0 p-0"
          )}
          {...props}
        />
        <div className="absolute inset-y-0 right-3 flex items-center">
          <kbd
            className={cn(
              "pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100 group-data-[state=expanded]/sidebar-wrapper:inline-flex"
            )}
          >
            <span className="text-xs">⌘</span>B
          </kbd>
        </div>
      </div>
    )
  }
)
SidebarSearch.displayName = "SidebarSearch"

const SidebarContent = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { state } = useSidebar()
    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "flex h-full flex-1 flex-col overflow-y-auto",
          className
        )}
        {...props}
      />
    )
  }
)
SidebarContent.displayName = "SidebarContent"

const SidebarNav = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex flex-col gap-1 p-2", className)}
        {...props}
      />
    )
  }
)
SidebarNav.displayName = "SidebarNav"

const SidebarNavList = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      />
    )
  }
)
SidebarNavList.displayName = "SidebarNavList"

const sidebarNavItemVariants = cva(
  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground/80 transition-all hover:bg-sidebar-muted hover:text-sidebar-foreground",
  {
    variants: {
      active: {
        true: "bg-sidebar-muted text-sidebar-foreground",
      },
    },
  }
)

const SidebarNavItem = React.forwardRef(
  (
    {
      className,
      children,
      icon,
      active,
      ...props
    },
    ref
  ) => {
    const { state } = useSidebar()
    const Icon = icon ? Slot : "div"

    if (state === "collapsed") {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              ref={ref}
              className={cn(
                sidebarNavItemVariants({ active }),
                "size-8 justify-center",
                className
              )}
              {...props}
            >
              <Icon className="size-4 shrink-0">{icon}</Icon>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {children}
          </TooltipContent>
        </Tooltip>
      )
    }

    return (
      <a
        ref={ref}
        className={cn(sidebarNavItemVariants({ active }), className)}
        {...props}
      >
        <Icon className="size-4 shrink-0">{icon}</Icon>
        <div className="min-w-0 flex-1 truncate">{children}</div>
      </a>
    )
  }
)
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    const { state } = useSidebar()

    return (
      <div
        ref={ref}
        className={cn(
          "mt-auto flex w-full flex-col gap-2 p-2",
          state === "collapsed" && "pointer-events-none items-center",
          className
        )}
        {...props}
      >
        <Separator />
        {children}
      </div>
    )
  }
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarHeaderSkeleton = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center gap-2 border-b p-2", className)}
      {...props}
    >
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-6 w-24" />
    </div>
  )
}

const SidebarNavSkeleton = ({
  className,
  rowCount = 5,
  ...props
}) => {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)} {...props}>
      {Array.from({ length: rowCount }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  )
}

export {
  useSidebar,
  SidebarProvider,
  Sidebar,
  SidebarToggle,
  SidebarHeader,
  SidebarTitle,
  SidebarSearch,
  SidebarContent,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarFooter,
  SidebarHeaderSkeleton,
  SidebarNavSkeleton,
} 