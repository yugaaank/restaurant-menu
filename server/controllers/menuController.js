import supabase from '../config/supabase.js'

export const getByRestaurant = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', req.params.restaurantId)
            .order('category')
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const create = async (req, res) => {
    try {
        const { restaurant_id, name, description, price, category, image, is_available } = req.body
        if (!restaurant_id || !name || !price || !category) {
            return res.status(400).json({ error: 'Restaurant ID, name, price, and category are required' })
        }
        const { data, error } = await supabase
            .from('menu_items')
            .insert([{ restaurant_id, name, description, price, category, image, is_available }])
            .select()
            .single()
        if (error) throw error
        res.status(201).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .update(req.body)
            .eq('id', req.params.id)
            .select()
            .single()
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const remove = async (req, res) => {
    try {
        const { error } = await supabase
            .from('menu_items')
            .delete()
            .eq('id', req.params.id)
        if (error) throw error
        res.json({ message: 'Deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
