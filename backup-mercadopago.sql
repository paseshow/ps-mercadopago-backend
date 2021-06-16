-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: mercadopagopaseshow
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devoluciones`
--

DROP TABLE IF EXISTS `devoluciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devoluciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservaId` int NOT NULL,
  `motivo` varchar(150) NOT NULL,
  `fechaDevolucion` bigint NOT NULL,
  `usuarioEncargadoId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservaId` (`reservaId`),
  KEY `usuarioEncargadoId` (`usuarioEncargadoId`),
  CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`reservaId`) REFERENCES `reservas` (`id`),
  CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`usuarioEncargadoId`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devoluciones`
--

LOCK TABLES `devoluciones` WRITE;
/*!40000 ALTER TABLE `devoluciones` DISABLE KEYS */;
INSERT INTO `devoluciones` VALUES (1,122042,'Error de compra',1623763202764,1),(2,122044,'error de compra',1623765503540,1);
/*!40000 ALTER TABLE `devoluciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservaReferenceMp`
--

DROP TABLE IF EXISTS `reservaReferenceMp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservaReferenceMp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservaId` int NOT NULL,
  `referenceId` varchar(100) NOT NULL,
  `clientMpId` bigint NOT NULL,
  `collectorId` bigint NOT NULL,
  `statusReference` varchar(10) DEFAULT 'pending',
  `idTransaccionMp` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reservaId` (`reservaId`),
  UNIQUE KEY `referenceId` (`referenceId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservaReferenceMp`
--

LOCK TABLES `reservaReferenceMp` WRITE;
/*!40000 ALTER TABLE `reservaReferenceMp` DISABLE KEYS */;
INSERT INTO `reservaReferenceMp` VALUES (1,122012,'456584334-89bfd217-1397-4490-ac22-d4b1c90b7e51',7765143967393000,456584334,'pending',NULL),(2,122013,'456584334-ff166992-ffc5-4218-9db2-bfbdabba125e',7765143967393000,456584334,'pending',NULL),(3,122015,'456584334-d80b3716-808e-4738-9b6b-e59873b210b4',7765143967393000,456584334,'approved',1237492525),(4,122018,'456584334-5a088b8c-73d6-45f1-8e1e-ca89dc38c170',7765143967393000,456584334,'approved',1237496715),(5,122019,'456584334-9b7f9f32-5ad8-4ebc-8f82-1912f3dca037',7765143967393000,456584334,'approved',1237504275),(6,122020,'456584334-d6a9044b-9386-41ca-aca2-1eb813c01350',7765143967393000,456584334,'pending',NULL),(7,122021,'456584334-eb0c491f-f52f-404b-8c65-30c28d29e61a',7765143967393000,456584334,'pending',NULL),(8,122022,'456584334-871c9dbf-a8ba-475a-8a73-bb87eae2a55c',7765143967393000,456584334,'approved',1237504713),(9,122023,'456584334-333bc6af-08af-44c1-89c4-b6b8868807fc',7765143967393000,456584334,'pending',NULL),(10,122025,'456584334-28340d4a-ae18-459e-83f9-8cfea2cd8030',7765143967393000,456584334,'pending',NULL),(11,122026,'456584334-8d36b3cb-0434-4cfa-8300-bfba2a65c8da',7765143967393000,456584334,'approved',1237508629),(12,122027,'456584334-294803a6-06ad-480a-8fca-c135b0513c85',7765143967393000,456584334,'pending',NULL),(13,122028,'456584334-7fbbbffa-b5ba-422a-8f27-44b740adb565',7765143967393000,456584334,'pending',NULL),(14,122032,'456584334-c8d746e6-885f-4703-aae2-1edfeeb459a4',7765143967393000,456584334,'approved',1237508879),(15,122035,'456584334-18d96db0-7e2a-48c6-a69e-969985393e83',7765143967393000,456584334,'approved',1237508910),(16,122038,'456584334-decec787-ddce-4ee7-aa94-535e3ed39ec4',7765143967393000,456584334,'approved',1237541261),(17,122039,'456584334-e66e9fae-652e-4027-a5d2-2bf57e10abed',7765143967393000,456584334,'approved',1237541404),(18,122040,'456584334-32dc7780-f440-4775-b9ca-c7e2298bcf18',7765143967393000,456584334,'approved',1237541556),(19,122041,'456584334-86409f09-d377-4652-8f50-52e13059bb50',7765143967393000,456584334,'pending',NULL),(20,122042,'456584334-4f43fdd5-1bd9-4e6d-a7d4-df722e007473',7765143967393000,456584334,'approved',1237567554),(21,122043,'456584334-7546a8fe-1a8e-4d41-8fa7-5c291660d01c',7765143967393000,456584334,'approved',1237575952),(22,122044,'456584334-2cde5346-35e4-4488-b01f-9c6a505b15bb',7765143967393000,456584334,'approved',1237575022),(23,122045,'456584334-396f7dd2-426a-4833-b8e3-d5f9e30fe131',7765143967393000,456584334,'pending',NULL),(24,122046,'456584334-4889e363-a3b8-4ee9-9383-329e32ca575a',7765143967393000,456584334,'pending',NULL),(25,122047,'456584334-031317b2-8cd5-4bb0-ae83-38ad6bd73f76',7765143967393000,456584334,'pending',NULL);
/*!40000 ALTER TABLE `reservaReferenceMp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservas`
--

DROP TABLE IF EXISTS `reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservas` (
  `id` int NOT NULL,
  `tipo` char(3) NOT NULL,
  `importeTotal` decimal(10,2) DEFAULT NULL,
  `importeTotalNeto` decimal(10,2) DEFAULT NULL,
  `serviceChargeTotal` decimal(10,2) DEFAULT NULL,
  `estado` char(1) NOT NULL,
  `boleteria` char(1) NOT NULL,
  `fechaReserva` bigint NOT NULL,
  `fechaFacturacion` bigint DEFAULT NULL,
  `turnoId` int DEFAULT NULL,
  `clienteDni` int NOT NULL,
  `clienteNombre` char(40) NOT NULL,
  `clienteEmail` char(50) DEFAULT NULL,
  `reservaPreferenceMpId` int NOT NULL,
  `eventoId` int NOT NULL,
  `eventoNombre` char(100) NOT NULL,
  `ubicacionEventoId` int NOT NULL,
  `ubicacionEventoEstado` char(1) NOT NULL,
  `ubicacionEventoFechaIngreso` bigint DEFAULT NULL,
  `sectorEventoDescripcion` char(150) NOT NULL,
  `sectorEventoFechaFuncion` bigint NOT NULL,
  `descuentoSectorDescripcion` char(45) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservaPreferenceMpId` (`reservaPreferenceMpId`),
  CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`reservaPreferenceMpId`) REFERENCES `reservaReferenceMp` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
INSERT INTO `reservas` VALUES (122012,'TST',100.00,NULL,0.00,'P','W',1623371137000,NULL,NULL,40108490,'Roger Bariless',NULL,1,150,'pruebTwicht',2875068,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122013,'TST',100.00,NULL,0.00,'P','W',1623371261000,NULL,NULL,40108490,'Roger Bariless',NULL,2,150,'pruebTwicht',2875069,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122015,'TST',100.00,NULL,0.00,'E','W',1623371744000,NULL,NULL,40108490,'Roger Bariless',NULL,3,150,'pruebTwicht',2875070,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122018,'TST',100.00,NULL,0.00,'P','W',1623425023000,NULL,NULL,40108490,'Roger Bariless',NULL,4,150,'pruebTwicht',2875071,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122019,'TST',100.00,NULL,0.00,'P','W',1623434486000,NULL,NULL,40108490,'Roger Bariless',NULL,5,150,'pruebTwicht',2875072,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122020,'TST',100.00,NULL,0.00,'P','W',1623436522000,NULL,NULL,40108490,'Roger Bariless',NULL,6,150,'pruebTwicht',2875073,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122021,'TST',100.00,NULL,0.00,'P','W',1623436691000,NULL,NULL,40108490,'Roger Bariless',NULL,7,150,'pruebTwicht',2875074,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122022,'TST',100.00,NULL,0.00,'P','W',1623436746000,NULL,NULL,40108490,'Roger Bariless',NULL,8,150,'pruebTwicht',2875075,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122023,'TST',100.00,NULL,0.00,'P','W',1623436828000,NULL,NULL,40108490,'Roger Bariless',NULL,9,150,'pruebTwicht',2875076,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122025,'TST',100.00,NULL,0.00,'P','W',1623438839000,NULL,NULL,40108490,'Roger Bariless',NULL,10,150,'pruebTwicht',2875078,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122026,'TST',100.00,NULL,0.00,'P','W',1623439473000,NULL,NULL,40108490,'Roger Bariless',NULL,11,150,'pruebTwicht',2875079,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122027,'TST',100.00,NULL,0.00,'P','W',1623440200000,NULL,NULL,40108490,'Roger Bariless',NULL,12,150,'pruebTwicht',2875080,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122028,'TST',100.00,NULL,0.00,'P','W',1623440234000,NULL,NULL,40108490,'Roger Bariless',NULL,13,150,'pruebTwicht',2875081,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122032,'TST',100.00,NULL,0.00,'P','W',1623440801000,NULL,NULL,40108490,'Roger Bariless',NULL,14,150,'pruebTwicht',2875085,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122035,'TST',100.00,NULL,0.00,'E','W',1623441008000,NULL,NULL,40108490,'Roger Bariless',NULL,15,150,'pruebTwicht',2875088,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122038,'TST',100.00,NULL,0.00,'E','W',1623680149000,NULL,NULL,40108490,'Roger Bariless',NULL,16,150,'pruebTwicht',2875086,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122039,'TST',100.00,NULL,0.00,'E','W',1623681297000,NULL,NULL,40108490,'Roger Bariless',NULL,17,150,'pruebTwicht',2875087,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122040,'TST',100.00,NULL,0.00,'E','W',1623682553000,NULL,NULL,40108490,'Roger Bariless',NULL,18,150,'pruebTwicht',2875089,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122041,'TST',100.00,NULL,0.00,'P','W',1623762815000,NULL,NULL,40108490,'Roger Bariless',NULL,19,150,'pruebTwicht',2875090,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122042,'TST',100.00,NULL,0.00,'A','W',1623762859000,NULL,NULL,40108490,'Roger Bariless',NULL,20,150,'pruebTwicht',2875091,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122043,'TST',100.00,NULL,0.00,'E','W',1623764777000,NULL,NULL,40108490,'Roger Bariless',NULL,21,150,'pruebTwicht',2875092,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122044,'TST',100.00,NULL,0.00,'A','W',1623765120000,NULL,NULL,40108490,'Roger Bariless',NULL,22,150,'pruebTwicht',2875093,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122045,'TST',100.00,NULL,0.00,'P','W',1623766802000,NULL,NULL,40108490,'Roger Bariless',NULL,23,150,'pruebTwicht',2875094,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122046,'TST',100.00,NULL,0.00,'P','W',1623766828000,NULL,NULL,40108490,'Roger Bariless',NULL,24,150,'pruebTwicht',2875095,'R',NULL,'Twitch Func',1613689200000,'MENORES'),(122047,'TST',100.00,NULL,0.00,'P','W',1623768752000,NULL,NULL,25858046,'Edgar miguel gonzales',NULL,25,150,'pruebTwicht',2875096,'R',NULL,'Twitch Func',1613689200000,'MENORES');
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `securityMercadoPago`
--

DROP TABLE IF EXISTS `securityMercadoPago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `securityMercadoPago` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accessToken` varchar(255) NOT NULL,
  `publicKey` varchar(255) NOT NULL,
  `userIdMp` bigint NOT NULL,
  `nombreCuenta` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `eventoId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `securityMercadoPago`
--

LOCK TABLES `securityMercadoPago` WRITE;
/*!40000 ALTER TABLE `securityMercadoPago` DISABLE KEYS */;
INSERT INTO `securityMercadoPago` VALUES (1,'TEST-7765143967393000-042116-2389ef370f47350b7f5e67264c54d03c-456584334','TEST-1b811805-e4e6-4b83-9786-07f9d573707a',456584334,'pase','paseshow',150),(2,'TEST-7765143967393000-042116-2389ef370f47350b7f5e67264c54d03c-456584334','TEST-1b811805-e4e6-4b83-9786-07f9d573707a',456584334,'paseshow','paseshow',150),(3,'TEST-7765143967393000-042116-2389ef370f47350b7f5e67264c54d03c-456584334','TEST-1b811805-e4e6-4b83-9786-07f9d573707a',456584334,'paseshow','paseshow',150);
/*!40000 ALTER TABLE `securityMercadoPago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` int NOT NULL,
  `pass` varchar(100) NOT NULL,
  `nameLastName` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,25858046,'$2b$10$qmnawtJE/BwF/GV/qE/j7eDqhkWT9eMcGl5kZacty0cXyeI9ec3Mu',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-06-15 19:47:37
