import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'

const db = useFirestore()

export const useAIBrands = () =>
  useState('ai-brands', () =>
    shallowRef(useCollection(collection(db, 'ai-marcas')))
  )
