/* eslint-disable react/prop-types */
import { Button } from '@mui/material';

function OrderSummaryForm({
  formik,
  selectedPaymentSystem,
  setSelectedPaymentSystem,
  paymentSystem,
  subTotal,
  deliveryFee,
  submitRef
}) {
  return (
    <div className="w-full lg:w-1/3 text-center">
      <div className="w-full bg-gray-100 p-5">
        <h2 className="font-semibold text-[#212529] font-mono mb-5">Order Summary</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Phone Number</label>
            <input
              type="tel"
              className="form-input w-1/2"
              placeholder="01xxxxxxxxx"
              {...formik.getFieldProps('phone')}
            />
          </div>
          {formik.touched.phone && formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}
          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Address</label>
            <input
              type="text"
              className="form-input w-1/2"
              placeholder="Your address"
              {...formik.getFieldProps('address')}
            />
          </div>
          {formik.touched.address && formik.errors.address && <div className="text-red-500">{formik.errors.address}</div>}
          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Payment Method</label>
            <select
              className="form-select w-1/2"
              value={selectedPaymentSystem}
              onChange={(e) => setSelectedPaymentSystem(parseInt(e.target.value, 10))}
            >
              {paymentSystem?.map((system, index) => (
                <option key={index} value={index}>
                  {system.paymantSystemName}
                </option>
              ))}
            </select>
          </div>
          <div className="pt-5 flex flex-col space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{subTotal != 0 ? deliveryFee.toFixed(2): 0}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{(subTotal + deliveryFee).toFixed(2)}</span>
            </div>
          </div>
          <Button ref={submitRef} type="submit" variant="contained" color="primary" className="mt-5 w-full">
            Confirm Order
          </Button>
        </form>
      </div>
    </div>
  );
}

export default OrderSummaryForm;
