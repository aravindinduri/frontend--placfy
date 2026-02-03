import PricingCards from '../../ui/PricingCards.jsx'
import { useGetPageContentQuery } from '../../utils/api.js';
import Spinner from '../../ui/Spinner.jsx';

function Pricing() {
  const { data, isLoading } = useGetPageContentQuery('pricing');

  if (isLoading) {
    return <div className="py-20"><Spinner /></div>;
  }

  const pricingContent = data?.content?.pricing;
  const title = pricingContent?.title || 'Choose the plan that fits';
  const subtitle = pricingContent?.subtitle || 'Simple pricing with powerful features. Upgrade as your team grows.';
  const plans = pricingContent?.plans;

  return (
    <section className="container-responsive py-16 md:py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-gradient">{title}</h1>
        <p className="mt-2 text-slate-600">{subtitle}</p>
      </div>
      <PricingCards full plans={plans} />
    </section>
  )
}

export default Pricing
