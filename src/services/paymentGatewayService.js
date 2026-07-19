class PaymentGatewayService {

    async transfer() {
        return {
            success: Math.random() * 100 >= process.env.PAYMENT_FAILURE_RATE
        };
    }
}

export default new PaymentGatewayService();