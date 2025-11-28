import CategoryItem from "./CategoryItem";

const categories = [
  { id: 1, title: "Special Edition", image: "luxury category 1.png", link: "special-edition" },
  { id: 2, title: "Luxury Collection", image: "luxury category 2.png", link: "luxury-collection" },
  { id: 3, title: "Summer Edition", image: "luxury category 3.png", link: "summer-edition" },
  { id: 4, title: "Unique Collection", image: "luxury category 4.png", link: "unique-collection" },
];

const CategoriesSection = () => {
  return (
    <section className="w-full py-20 bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto px-5">
        
        {/* Modern Header */}
        <div className="mb-14 text-center">
          <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase mb-4">
            Select Category
          </h2>
          <div className="w-24 h-1.5 bg-black mx-auto"></div>
        </div>

        {/* GRID UPDATES:
           1. place-items-center: Keeps the smaller cards centered in their slot.
           2. gap-10: More breathing room for the 3D tilt effect.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              categoryTitle={category.title}
              image={category.image}
              link={category.link}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default CategoriesSection;