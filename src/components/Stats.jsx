

function Stats() {
  const stats = [
    {
      value: "₦50M+",
      label: "Investments Raised",
    },
    {
      value: "500+",
      label: "Happy Investors",
    },
    {
      value: "120",
      label: "Farm Projects",
    },
    {
      value: "98%",
      label: "Success Rate",
    },
  ];

  return (
    <section className="stats">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <h2>{stat.value}</h2>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;