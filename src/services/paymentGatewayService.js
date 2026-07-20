class PaymentGatewayService {
    async transfer() {
        return {
            //mocking a payment gateway for random success/failure
            //this service can be later replaced with an actual gateway without any rewiring in workers, its modular
            success: Math.random() * 100 >= process.env.PAYMENT_FAILURE_RATE
        };
    }
}

export default new PaymentGatewayService();