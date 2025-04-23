const Prestataire = require("../models/Prestataire");
const Notification = require("../models/Notification");
const mongoose = require('mongoose');
const Appointment = require("../models/Appointment");

const PrestataireController = {
// GET ALL Prestataires
 async getAllPrestataires (req,res) {

    try{
    const prestataires = await Prestataire.find();

    return res.status(200).json({error:false,prestataires,message:"Get prestataires successful !"});
    
    }catch(error) {
        return res.status(500).json({error:true,message:"Internal Server Error !"});
    }

},
// get one prestataire by ID 
 async getPrestataire (req,res){
    const {id} = req.params;
    try{
        const prestataire = await Prestataire.findOne({_id:id});
        return res.status(200).json({message:"prestataire retrieved successfully",prestataire});
    } catch(error)
    {
        return res.status(500).json({message:"Internal Server Error"});
    }

},
// Accept Appointment
async acceptAppointment(req, res) {
  const { id } = req.params; // Appointment ID from route parameters
  const user = req.user; // The logged-in Prestataire

  try {
    // Get the appointment based on the Prestataire ID and appointment ID
    const appointment = await Appointment.findOne({ _id: id, prestataireId: user._id });

    if (!appointment) {
      return res.status(404).json({ error: true, message: "Appointment not found" });
    }

    // Update the appointment status to 'confirmed'
    appointment.status = "confirmed";
    await appointment.save();

    console.log("Accepted appointment");

    // Send notification to the client who made the reservation
    try {
      const notification = new Notification({
        recipientId: appointment.clientId, // ID of the client
        recipientModel: "User", // Assuming the client is a User
        type: "acceptation",
        message: `The appointment you booked with ${user.firstname} ${user.lastname} has been accepted.`,
        reservationId: id,
      });

      await notification.save();

      console.log("Notification sent to client");
    } catch (notificationError) {
      return res.status(500).json({
        message: "Error creating the notification",
        error: notificationError,
      });
    }

    // Respond with success
    return res.status(200).json({
      message: "Appointment accepted successfully!",
      appointment,
    });
  } catch (error) {
    // Handle general server errors
    return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
},

  // Reject Appointment 
  async rejectAppointment(req, res) {
    const { id } = req.params;
    const user = req.user;

    try {
      const appointment = await Appointment.findOneAndUpdate(
        { _id: id }, //find By ID
        { status: 'cancelled' }, //update the status to cancelled 
        { new: true }); //return the new document 
      await appointment.save();
    // Send notification to the client who made the reservation
    try {
      const notification = new Notification({
        recipientId: appointment.clientId, // ID of the client
        recipientModel: "User", // Assuming the client is a User
        type: "rejetation",
        message: `The appointment you booked with ${user.firstname} ${user.lastname} has been rejected.`,
        reservationId: id,
      });

      await notification.save();

      console.log("Notification sent to client");
    } catch (notificationError) {
      return res.status(500).json({
        message: "Error creating the notification",
        error: notificationError,
      });
    }

    // Respond with success
    return res.status(200).json({
      message: "Appointment rejected successfully!",
      appointment,
    });
    } catch (error) {
      return res.status(500).json({message:"Internal Server Error",error});
    }
 
  },


async markAllNotificationsAsRead (req, res) {
    const { id } = req.params;  // Extract prestataire id from route parameter
  
    try {
      // Update all unread notifications for the given prestataire to "read"
      const result = await Notification.updateMany(
        { prestataireId: id, isRead: false },
        { $set: { isRead: true } }
      );
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: 'All notifications marked as read.' });
      } else {
        return res.status(200).json({ message: 'No unread notifications found.' });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal Server error.' });
    }
  },

  async editPrestataire (req,res) {
    const {id} = req.params;
    const {
        firstname,
        lastname,
        email,
        nomEtablissement,
        description,
        specialites,
        adresse,
        telephoneProfessionnel,
        horairesDisponibilite,
        tarifs,
        
        } = req.body;


    if(!firstname && !lastname && !email &&!nomEtablissement && !description && !specialites && !adresse && !telephoneProfessionnel && !horairesDisponibilite && !tarifs ){
        return res.status(400).json({error:true,message:"No changes provided ! "});
    }
    try{
          // Validate if the ID is a valid MongoDB ObjectId before proceeding
        if (!mongoose.Types.ObjectId.isValid(id)) 
        {
        return res.status(400).json({ error: true, message: "Invalid ID format" });
        }
    const prestataire = await Prestataire.findOne({_id,id});
    if(!prestataire) return res.status(400).json({error:true,message:"Prestataire not found!"});

    if(firstname) prestataire.firstname = firstname;
    if(lastname) prestataire.lastname = lastname;
    if(email){
      if(await Prestataire.findOne({email})) return res.status(400).json({error:true,message:"this email is already taken"});
      prestataire.email = email;
    }
    if(nomEtablissement) prestataire.nomEtablissement = nomEtablissement;
    if(description) prestataire.description = description;
    if(specialites) prestataire.specialites = specialites;
    if(adresse) prestataire.adresse = adresse;
    if(telephoneProfessionnel) prestataire.telephoneProfessionnel = telephoneProfessionnel;
    if(horairesDisponibilite) prestataire.horairesDisponibilite = horairesDisponibilite;
    if(tarifs) prestataire.tarifs = tarifs; 

    await prestataire.save();

    return res.status(200).json({
        error:false,
        prestataire,
        message:"Prestataire Updated Successfully"
    });

    }catch(error){
        return res.status(400).json({error:true,message:"Internal Server Error"});
    }

},

async deletePrestataire (req,res) {

    const { id } = req.params;
    try{
          // Validate if the ID is a valid MongoDB ObjectId before proceeding
          if (!mongoose.Types.ObjectId.isValid(id)) 
            {
            return res.status(400).json({ error: true, message: "Invalid ID format" });
            }
    const prestataire = await Prestataire.findOneAndDelete({_id:id});

    if (!prestataire) {
        return res.status(404).json({ error: true, message: "Prestataire not found!" });
    }

    return res.status(204).json({error:false,message:"Prestataire deleted successful!"});    
    }catch(error){
    return res.status(500).json({error:true,message:"Error Deleting prestataire !"});   
    
    };

},

}

module.exports= PrestataireController;








  

// Create New Prestataire  
// the prestataires will be added in the register function we will back to this function if we add the admin role  
// exports.createPrestataire = async (req, res) => {
//           const {
//             firstname,
//             lastname,
//             email,
//             password,
//             nomEtablissement,
//             description,
//             specialites,
//             adresse,
//             telephoneProfessionnel,
//             horairesDisponibilite,
//             tarifs,
//             avis,
//             } = req.body;

//           const user = req.user;

//             if(  !firstname || !lastname || !email || !nomEtablissement || !description || !specialites || !adresse || !telephoneProfessionnel || !horairesDisponibilite || !tarifs ){
//                 return res.status(400).json({error:true,message:"Missed Fields !!"});
//             }

//             try{

//             const NewPrestataire = new Prestataire({
//                 idUtilisateur,
//                 nomEtablissement,
//                 description,
//                 specialites : specialites || [],
//                 adresse,
//                 telephoneProfessionnel,
//                 tarifs,
//                 avis: avis || []
//             });
//             await NewPrestataire.save();
//             return res.status(200).json({error:false,message:"new prestataire created successfully",NewPrestataire})

//             }catch(error){
//                 return res.status(500)
//                 .json({
//                     error:true,
//                     message:"Internal Server Error"
//                 });
//             };

// };

// Edit an exist Prestataire


//delete a Prestataire

