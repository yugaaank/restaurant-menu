import supabase from '../config/supabase.js'

export const getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getOne = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', req.params.id)
            .single()
        if (error) return res.status(404).json({ error: 'Not found' })
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const create = async (req, res) => {
    try {
        const { name, cuisine, address, image, is_open } = req.body
        if (!name || !cuisine || !address) {
            return res.status(400).json({ error: 'Name, cuisine, and address are required' })
        }
        const { data, error } = await supabase
            .from('restaurants')
            .insert([{ name, cuisine, address, image, is_open }])
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
            .from('restaurants')
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
            .from('restaurants')
            .delete()
            .eq('id', req.params.id)
        if (error) throw error
        res.json({ message: 'Deleted successfully' })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
