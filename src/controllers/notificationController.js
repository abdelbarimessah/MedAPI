const Notification = require('../models/Notification');



const NotificationController = {
    async markNotificationAsRead (req, res) {
        const { id } = req.params; // Notification ID
      
        try {
          const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true }, // Update the isRead field to true
            { new: true } // Return the updated document
          );
      
          if (!notification) {
            return res.status(404).json({ error: true, message: 'Notification not found' });
          }
      
          return res.status(200).json({ error: false, message: 'Notification marked as read', data: notification });
        } catch (error) {
          console.error('Error marking notification as read:', error);
          return res.status(500).json({ error: true, message: 'Internal server error' });
        }
      },
    async deleteNotification (req,res) {
        const {id} = req.params;
        
        try{
          const notification = await Notification.findOneAndDelete({_id,id});
          if (!notification) {
            return res.status(404).json({ error: true, message: 'Notification not found' });
          }

          return res.status(200).json({ error: false, message: 'Notification deleted'});
        } catch (error) {
          console.error('Error deleting the notification:', error);
          return res.status(500).json({ error: true, message: 'Internal server error' });
        }
    },
    
    async getUserNotification (req,res) {
      const {id} = req.params;
      const role = req.user.role;
      let Model = role ==="client"?"User":role==="prestataire"?"Prestataire":""
      if(!Model)return res.status(400).json({message:"role not specified"});
      try{
          const notifications = await Notification.find(
              {recipientModel:Model,recipientId: id }).sort({ createdAt: -1 }); // Sort by newest first
             return res.status(200)
             .json({
              message:"notification retrieved successfully!",
              notifications
          }) 
      } catch(error) {
          return res.status(500)
          .json({
              message:"Internal Server Error",
              error:error.message
          });
      }
    }
}

module.exports = NotificationController;