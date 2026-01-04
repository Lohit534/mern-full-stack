import React, { useContext, useEffect, useState } from 'react'
import './TrackOrder.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { useParams, useNavigate } from 'react-router-dom'

const TrackOrder = () => {
    const { orderId } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const { url, token, currency } = useContext(StoreContext)
    const navigate = useNavigate()

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } })
            if (response.data.success) {
                const foundOrder = response.data.data.find(o => o._id === orderId)
                setOrder(foundOrder)
            }
            setLoading(false)
        } catch (error) {
            console.error("Error fetching order:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token && orderId) {
            fetchOrderDetails()
        }
    }, [token, orderId])

    if (loading) {
        return <div className='track-order'><h2>Loading...</h2></div>
    }

    if (!order) {
        return (
            <div className='track-order'>
                <h2>Order Not Found</h2>
                <button onClick={() => navigate('/myorders')}>Back to My Orders</button>
            </div>
        )
    }

    return (
        <div className='track-order'>
            <div className="track-order-header">
                <h2>Track Order</h2>
                <button onClick={() => navigate('/myorders')} className="back-button">← Back to Orders</button>
            </div>

            <div className="order-details">
                <div className="order-info-card">
                    <h3>Order Details</h3>
                    <div className="info-row">
                        <span className="label">Order ID:</span>
                        <span className="value">{order._id}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Total Amount:</span>
                        <span className="value">{currency}{order.amount}.00</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Items Count:</span>
                        <span className="value">{order.items.length}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Status:</span>
                        <span className={`status ${order.status.toLowerCase().replace(' ', '-')}`}>
                            ● {order.status}
                        </span>
                    </div>
                </div>

                <div className="order-items-card">
                    <h3>Order Items</h3>
                    <div className="items-list">
                        {order.items.map((item, index) => (
                            <div key={index} className="item-row">
                                <img src={assets.parcel_icon} alt="" />
                                <div className="item-details">
                                    <p className="item-name">{item.name}</p>
                                    <p className="item-quantity">Quantity: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-tracking-card">
                    <h3>Order Tracking</h3>
                    <div className="tracking-timeline">
                        <div className={`timeline-step ${['Food Processing', 'Out for delivery', 'Delivered'].includes(order.status) ? 'completed' : order.status === 'Food Processing' ? 'active' : ''}`}>
                            <div className="step-icon">●</div>
                            <div className="step-content">
                                <p className="step-title">Food Processing</p>
                                <p className="step-desc">Your order is being prepared</p>
                            </div>
                        </div>
                        <div className={`timeline-step ${['Out for delivery', 'Delivered'].includes(order.status) ? 'completed' : order.status === 'Out for delivery' ? 'active' : ''}`}>
                            <div className="step-icon">●</div>
                            <div className="step-content">
                                <p className="step-title">Out for Delivery</p>
                                <p className="step-desc">Your order is on the way</p>
                            </div>
                        </div>
                        <div className={`timeline-step ${order.status === 'Delivered' ? 'completed active' : ''}`}>
                            <div className="step-icon">●</div>
                            <div className="step-content">
                                <p className="step-title">Delivered</p>
                                <p className="step-desc">Order has been delivered</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TrackOrder
