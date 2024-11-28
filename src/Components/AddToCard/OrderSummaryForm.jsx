/* eslint-disable react/prop-types */
import { Button } from '@mui/material';
import { allDivision, districtsOf, upazilasOf } from '@bangladeshi/bangladesh-address';
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
    <div className="w-full lg:w-2/5 text-center">
      <div className="w-full bg-gray-100 p-5">
        <h2 className="font-semibold text-[#212529] font-mono mb-5">Order Summary</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Phone Number</label>
            <input
              type="tel"
              className="w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black"
              placeholder="01xxxxxxxxx"
              {...formik.getFieldProps('phone')}
            />
          </div>
          {formik.touched.phone && formik.errors.phone && <div className="text-red-500">{formik.errors.phone}</div>}


          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Division</label>
            <select
              name="division"
              id="division"
              onChange={formik.handleChange}
              value={formik.values.division}
              // {...formik.getFieldProps('division')}
              className='w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
            >
              <option value="" disabled>Select Division</option>
              {allDivision().map((division) => (
                  <option key={division} value={division}>
                      {division}
                  </option>
              ))}
            </select>
          </div>
          {formik.touched.division && formik.errors.division && <div className="text-red-500">{formik.errors.division}</div>}


          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">District</label>
            <select
              name="district"
              id="district"
              disabled={!formik.values.division}
              onChange={formik.handleChange}
              value={formik.values.district}
              // {...formik.getFieldProps('district')}
              className='w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
            >
              <option value="" disabled>Select District</option>
              {formik.values.division &&
                  districtsOf(formik.values.division).map((district) => (
                      <option key={district} value={district}>
                          {district}
                      </option>
              ))}
            </select>
          </div>
          {formik.touched.district && formik.errors.district && <div className="text-red-500">{formik.errors.district}</div>}

          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Upazila</label>
            <select
              name="upazila"
              id="upazila"
              disabled={!formik.values.district}
              onChange={formik.handleChange}
              value={formik.values.upazila}
              // {...formik.getFieldProps('upazila')}
              className='w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
            >
              <option value="" disabled>Select Upazila</option>
              {formik.values.district &&
                  upazilasOf(formik.values.district).map((upazilaObj) => (
                      <option key={upazilaObj.upazila} value={upazilaObj.upazila}>
                          {upazilaObj.upazila}
                      </option>
              ))}
            </select>
            
          </div>
          {formik.touched.upazila && formik.errors.upazila && <div className="text-red-500">{formik.errors.upazila}</div>}

          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Postal Code</label>
            <input 
              type="text"  
              name='code'
              id='code'
              disabled={!formik.values.upazila}
              onChange={formik.handleChange}
              value={formik.values.code}
              placeholder='Enter your Postal Code'
              className='w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black'
            />
          </div>


          <div className="flex justify-between items-center">
            <label className="text-md font-light text-[#212529]">Payment Method</label>
            <select
              className="w-1/2 rounded-md bg-transparent border border-white outline-none p-2 text-md font-thin text-black placeholder:text-black"
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
