import supabase from '../config/supabase.js'

export const getAll = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        restaurants ( name ),
        order_items (
          *,
          menu_items ( image )
        )
      `)
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
            .from('orders')
            .select(`
        *,
        restaurants ( name ),
        order_items (
          *,
          menu_items ( image )
        )
      `)
            .eq('id', req.params.id)
            .single()
        if (error) return res.status(404).json({ error: 'Not found' })
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const getByRestaurant = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (
            *,
            menu_items ( image )
        )
      `)
            .eq('restaurant_id', req.params.restaurantId)
            .order('created_at', { ascending: false })
            .limit(20)
        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const create = async (req, res) => {
    try {
        const {
            customer_name, customer_phone, address, note,
            restaurant_id, items, total_amount
        } = req.body

        // Step 1: Validate
        if (!customer_name || !customer_phone || !address || !restaurant_id || !items || items.length === 0 || !total_amount) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        // Step 2: Insert Order
        const { data: newOrder, error: orderError } = await supabase
            .from('orders')
            .insert([{
                restaurant_id,
                customer_name,
                customer_phone,
                address,
                note,
                total_amount,
                status: 'pending'
            }])
            .select()
            .single()

        if (orderError) throw orderError

        // Step 3: Insert Order Items
        const orderItems = items.map(item => ({
            order_id: newOrder.id,
            menu_item_id: item.menu_item_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) throw itemsError

        // Step 4: Fetch complete order
        const { data: completeOrder, error: fetchError } = await supabase
            .from('orders')
            .select(`
        *,
        restaurants ( name ),
        order_items (
          *,
          menu_items ( image )
        )
      `)
            .eq('id', newOrder.id)
            .single()

        if (fetchError) throw fetchError

        res.status(201).json(completeOrder)

    } catch (error) {
        console.error("Order creation failed:", error)
        res.status(500).json({ error: error.message })
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body
        const allowedStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' })
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', req.params.id)
            .select()
            .single()

        if (error) throw error
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
