export interface MenuItem {
    id: string
    type: "page" | "custom" | "product" | "category"
    title: string
    url?: string
    children?: MenuItem[]
  }
  
  export interface MenuSection {
    id: "header" | "footer"
    items: MenuItem[]
  }
  
  