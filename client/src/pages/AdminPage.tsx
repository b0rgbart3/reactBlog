import { AdminPanel } from "../admin/AdminPanel";
import { BannerNav } from "../components/banner-nav";
import { useStore } from "../state/useStore";


export function AdminPage() {
  const user = useStore((s) => s.user);
    return(   
        
        <>
        
            <BannerNav page='admin' />
            
            {user?.author &&
            (
              <AdminPanel />
            )}</>
        )
}