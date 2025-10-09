import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/admin/AppSidebar"

const layout = ({children}) => {
  return (
    
    <SidebarProvider>
      <AppSidebar />
      <main> 
        {children}
      </main>
    </SidebarProvider>
  )
}

export default layout