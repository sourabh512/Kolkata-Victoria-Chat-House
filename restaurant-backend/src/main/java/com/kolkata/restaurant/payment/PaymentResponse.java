package com.kolkata.restaurant.payment;

public class PaymentResponse {

    private String orderId;
    private Object amount;
    private String currency;

    public PaymentResponse(String orderId, Object amount, String currency) {
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
    }

    public String getOrderId() {
        return orderId;
    }

    public Object getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }
}