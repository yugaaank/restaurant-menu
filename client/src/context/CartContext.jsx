import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [restaurantId, setRestaurantId] = useState(null)
    const [restaurantName, setRestaurantName] = useState('')

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('food_cart')
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart)
                setCart(parsed.cart || [])
                setRestaurantId(parsed.restaurantId || null)
                setRestaurantName(parsed.restaurantName || '')
            } catch (e) {
                console.error("Failed to parse cart from local storage", e)
            }
        }
    }, [])

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('food_cart', JSON.stringify({ cart, restaurantId, restaurantName }))
    }, [cart, restaurantId, restaurantName])

    const addToCart = (item, restId, restName) => {
        if (restaurantId && restaurantId !== restId && cart.length > 0) {
            const confirmChange = window.confirm("Start new cart from this restaurant? Your current cart will be cleared.")
            if (!confirmChange) return

            // Clear and start new
            setCart([{ ...item, quantity: 1 }])
            setRestaurantId(restId)
            setRestaurantName(restName)
        } else {
            // Same restaurant or empty cart
            if (!restaurantId) {
                setRestaurantId(restId)
                setRestaurantName(restName)
            }

            setCart(prev => {
                const existing = prev.find(i => i.menuItemId === item.menuItemId)
                if (existing) {
                    return prev.map(i => i.menuItemId === item.menuItemId ? { ...i, quantity: i.quantity + 1 } : i)
                }
                return [...prev, { ...item, quantity: 1 }]
            })
        }
    }

    const removeFromCart = (menuItemId) => {
        setCart(prev => prev.filter(i => i.menuItemId !== menuItemId))
        if (cart.length <= 1) {
            setRestaurantId(null)
            setRestaurantName('')
        }
    }

    const updateQuantity = (menuItemId, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.menuItemId === menuItemId) {
                    const newQty = item.quantity + delta
                    return newQty > 0 ? { ...item, quantity: newQty } : null
                }
                return item
            }).filter(Boolean)
        })

        // Check if cart became empty after update
        // Note: Since set state is async, we check the result in the next render or use a callback, 
        // but here we can just rely on the effect or check the filtered length for immediate cleanup logic if needed.
        // However, for simplicity, we'll let the next render handle empty state cleanup if we want to reset restaurantId.
        // Actually, let's do a check in useEffect or here.
    }

    // Cleanup restaurantId if cart becomes empty
    useEffect(() => {
        if (cart.length === 0) {
            setRestaurantId(null)
            setRestaurantName('')
        }
    }, [cart])

    const clearCart = () => {
        setCart([])
        setRestaurantId(null)
        setRestaurantName('')
    }

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    }, [cart])

    const cartCount = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0)
    }, [cart])

    return (
        <CartContext.Provider value={{
            cart,
            restaurantId,
            restaurantName,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    )
}
