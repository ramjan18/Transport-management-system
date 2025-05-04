const User = require("../../models/user");
const Bookings = require("../../models/transporterBooking");
const Goods = require("../../models/goods");
const Purchase = require("../../models/purchaseOrder");
const Transporter = require("../../models/transporter");

const deleteUser = async(req,res)=>{
    try {
        const {id} = req.params;
        const user =await User.findByIdAndDelete(id);
        console.log(user);
        if(!user){
            return res.status(404).json({
                msg: "User not found"
            })
        }
        if(user.role === 'farmer'){
            const goods = await Goods.findOne({farmer : id});
             const purchaseOrders = await Purchase.deleteMany({
                 goods: { $in: goods.map((g) => g._id) },
            })
            const deletedGoods = await Goods.deleteMany({farmer: id});
            const deletedBookings = await Bookings.deleteMany({farmer:id})
           
        }
        if(user.role === 'trader'){
            const deletePurchase = await Purchase.deleteMany({trader : id});
            const deletedBookings = await Bookings.deleteMany({ farmer: id });

        }
        if(user.role === 'transporter'){
            const deleteReq = await Bookings.deleteMany({transporter : id});
            await Transporter.deleteMany({user : id});
        }
        return res.status(201).json({
            msge : "User deleted Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msge : "Failed to delete"
        })
    }
}

module.exports = {deleteUser};