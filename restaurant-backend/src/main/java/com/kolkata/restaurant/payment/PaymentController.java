package com.kolkata.restaurant.payment;

import com.razorpay.Order;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/payment")
public class PaymentController {


    private final PaymentService paymentService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PaymentController(
            PaymentService paymentService) {

        this.paymentService =
                paymentService;
    }


    // ==========================================
    // CREATE RAZORPAY ORDER
    // ==========================================

    @PostMapping("/create-order")
    public ResponseEntity<PaymentResponse> createOrder(
            @RequestParam double amount) {

        try {

            Order order =
                    paymentService.createOrder(amount);


            PaymentResponse response =
                    new PaymentResponse(
                            order.get("id"),
                            order.get("amount"),
                            order.get("currency")
                    );


            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // ==========================================
    // VERIFY RAZORPAY PAYMENT
    // ==========================================

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody PaymentVerificationRequest request) {

        try {

            boolean verified =
                    paymentService.verifyPayment(
                            request.getRazorpayOrderId(),
                            request.getRazorpayPaymentId(),
                            request.getRazorpaySignature()
                    );


            if (verified) {

                return ResponseEntity.ok(
                        "{\"status\":\"success\"}"
                );
            }


            return ResponseEntity
                    .badRequest()
                    .body(
                            "{\"status\":\"failed\"}"
                    );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "{\"status\":\"error\"}"
                    );
        }
    }
}