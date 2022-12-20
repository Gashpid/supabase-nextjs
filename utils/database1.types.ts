export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database1 {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          updated_at: string | null
          productname: string | null
          product_cost: string | null
          product_url: string | null
        }
        Insert: {
          id: string
          updated_at: string | null
          productname: string | null
          product_cost: string | null
          product_url: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          productname?: string | null
          product_cost?: string | null
          product_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

function Database1(values:Array<Text>){
  return {
    public: {
      Tables: {
        values: {
          Row: {

          }
        }
      }
    }
  }
}