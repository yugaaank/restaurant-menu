import supabase from './config/supabase.js'

export async function seed() {
    console.log('🌱 Starting seed with enhanced images...')

    try {
        // Clear existing data
        console.log('Cleaning up old data...')
        await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000')
        await supabase.from('restaurants').delete().neq('id', '00000000-0000-0000-0000-000000000000')

        const restaurants = [
            {
                name: 'Pizza Palace',
                cuisine: 'Italian',
                address: '123 Main St',
                image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
                menu_images: {
                    Starter: 'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=500&q=60', // Salad
                    Main: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60', // Pizza
                    Dessert: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=500&q=60', // Cake
                    Drink: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60' // Cola
                }
            },
            {
                name: 'Burger Barn',
                cuisine: 'American',
                address: '456 Oak Ave',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80',
                menu_images: {
                    Starter: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=500&q=60', // Fries
                    Main: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60', // Burger
                    Dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=60', // Donut
                    Drink: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=60' // Milkshake
                }
            },
            {
                name: 'Sushi Station',
                cuisine: 'Japanese',
                address: '789 Pine Rd',
                image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
                menu_images: {
                    Starter: 'https://images.unsplash.com/photo-1626804475297-411dbbb8e7df?auto=format&fit=crop&w=500&q=60', // Gyoza
                    Main: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=60', // Sushi
                    Dessert: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d1?auto=format&fit=crop&w=500&q=60', // Ice Cream
                    Drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=500&q=60' // Tea
                }
            },
            {
                name: 'Spice Garden',
                cuisine: 'Indian',
                address: '321 Curry Ln',
                image: 'https://images.unsplash.com/photo-1517244683847-745431d51edf?auto=format&fit=crop&w=800&q=80',
                menu_images: {
                    Starter: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=60', // Samosa
                    Main: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=500&q=60', // Curry
                    Dessert: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=500&q=60', // Gulab Jamun
                    Drink: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=60' // Lassi
                }
            }
        ]

        for (const r of restaurants) {
            const { data: rest, error: restError } = await supabase
                .from('restaurants')
                .insert([{
                    name: r.name,
                    cuisine: r.cuisine,
                    address: r.address,
                    image: r.image,
                    is_open: true
                }])
                .select()
                .single()

            if (restError) throw restError
            console.log(`Created restaurant: ${rest.name}`)

            const menuItems = []
            const categories = ['Starter', 'Main', 'Dessert', 'Drink']

            for (const cat of categories) {
                // Create 2 items per category to populate menu better
                menuItems.push({
                    restaurant_id: rest.id,
                    name: `${rest.name} ${cat} 1`,
                    description: `Delicious ${cat.toLowerCase()} #1 from ${rest.name}`,
                    price: (Math.random() * 20 + 5).toFixed(2),
                    category: cat,
                    image: r.menu_images[cat],
                    is_available: true
                })
                menuItems.push({
                    restaurant_id: rest.id,
                    name: `${rest.name} ${cat} 2`,
                    description: `Delicious ${cat.toLowerCase()} #2 from ${rest.name}`,
                    price: (Math.random() * 20 + 5).toFixed(2),
                    category: cat,
                    image: r.menu_images[cat],
                    is_available: true
                })
            }

            const { error: menuError } = await supabase.from('menu_items').insert(menuItems)
            if (menuError) throw menuError
            console.log(`  Added ${menuItems.length} menu items`)
        }

        console.log('✅ Seeded successfully with enhanced images!')

    } catch (error) {
        console.error('❌ Seeding failed:', error)
    }
}

seed()
