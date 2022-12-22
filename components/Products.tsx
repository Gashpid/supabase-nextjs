import { useUser, useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import UploadImage from '../supabase/UploadImageProducts'
import { Database } from '../utils/database.types'
import { useState, useEffect } from 'react'

type DataStructure = Database['public']['Tables']['products']['Row']

export default function Products({ session }: { session: Session }) {

  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const [loading, setLoading] = useState(true)

  type UrlImage = DataStructure['product_url']  

  const [productname, setProductname] = useState<DataStructure['productname']>(null)
  const [product_cost, setCost] = useState<DataStructure['product_cost']>(null)
  const [product_url, setProductUrl] = useState<DataStructure['product_url']>(null)

  useEffect(() => {
    getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
        .from('products')
        .select(`productname, product_cost, product_url`)
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setProductname(data.productname)
        setCost(data.product_cost)
        setProductUrl(data.product_url)
      }
    } catch (error) {
      alert('Error loading user data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    productname,
    product_cost,
    product_url,
  }: {
    productname: DataStructure['productname']
    product_cost: DataStructure['product_cost']
    product_url: DataStructure['product_url']
  }) {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        productname,
        product_cost,
        product_url,
        updated_at: new Date().toISOString(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
      <UploadImage
        uid={'cambiar nombre'}
        url={'product_url'}
        bucket={'products'}
        size={150}
        onUpload={(url) => {
        setProductUrl(url)
        updateProfile({ productname, product_cost, product_url: url })
      }} ></UploadImage>

      <div>
        <label htmlFor="ProductName">Product name</label>
        <input 
          id="ProductName"
          type="text"
          value={productname || ''}
          onChange={(e) => setProductname(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="ProductCost">Cost</label>
        <input
          id="ProductCost"
          type="text"
          value={product_cost || ''}
          onChange={(e) => setCost(e.target.value)}
        />
      </div>
      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ productname, product_cost, product_url })}
          disabled={loading}
        >
          {loading ? 'Loading ...' : 'Update'}
        </button>
      </div>

      <div>
        <button className="button block" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

function keys<T>() {
  throw new Error('Function not implemented.')
}
