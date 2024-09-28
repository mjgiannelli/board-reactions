const express = require('express');
require("dotenv").config()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const cors = require("cors")
const path = require('path');

//import ApolloServer
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');

//import our typeDefs and resolvers
const { typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware
  });
  
server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())

app.post("/payment", cors(), async (req, res) => {
	let { amount, id } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Board Reactions LLC",
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})

// Serve up static assets
app.use('/images', express.static(path.join(__dirname, '../client/images')));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => {
    const graphqlPath = server.graphqlPath;
    console.log(`API server running on port ${PORT}!`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`Use GraphQL at ${process.env.RENDER_EXTERNAL_URL}${graphqlPath}`);
    } else {
      console.log(`Use GraphQL at http://localhost:${PORT}${graphqlPath}`);
    }
  });
});