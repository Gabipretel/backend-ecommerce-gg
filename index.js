import sequelize from "./src/db/connection.js";
import app from "./src/app/app.js";

const PORT = process.env.PORT || 3000;

  async function initServer() {
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente.');
  
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await sequelize.sync({ force: false });
      console.log("✅ Modelos sincronizados con la base de datos");
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('No se pudo conectar a la base de datos:', error);
    }
  }
  
  initServer();