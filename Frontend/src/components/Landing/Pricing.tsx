import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for getting started",
      features: [
        "Basic gamification features",
        "Limited AI-generated quizzes",
        "Community forum access",
        "Basic progress tracking",
        "Email support"
      ]
    },
    {
      name: "Pro",
      price: "$12",
      description: "Most popular for learners",
      features: [
        "Advanced gamification",
        "Unlimited AI quizzes",
        "Team challenges",
        "Detailed analytics",
        "Priority support",
        "Custom learning paths",
        "Virtual currency rewards"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations & teams",
      features: [
        "Custom gamification rules",
        "Advanced analytics & reporting",
        "Dedicated success manager",
        "Custom integrations",
        "Team management",
        "API access",
        "SLA guarantee"
      ]
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Pricing</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your learning journey. No hidden fees.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`h-full rounded-2xl bg-white/10 backdrop-blur-lg border ${plan.popular ? 'border-purple-500' : 'border-white/20'} p-8 hover:bg-white/20 transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-gray-400">/month</span>}
                  </div>
                  <p className="text-gray-300">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-400 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}>
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};