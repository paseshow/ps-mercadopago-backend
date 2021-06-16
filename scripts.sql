create database if not exists mercadopagopaseshow;

use mercadopagopaseshow;

create table if not exists reservaReferenceMp (
    id int(11) not null auto_increment primary key,
    reservaId int(11) not null unique,
    referenceId varchar(100) not null unique,
    clientMpId bigint not null,
    collectorId bigint not null,
    statusReference varchar(10) default "pending",
    idTransaccionMp bigint default null
);

create table if not exists reservas (
    id int(11) not null primary key,
    tipo char(3) not null,
    importeTotal decimal(10,2) default null,
    importeTotalNeto decimal(10,2) default null,
    serviceChargeTotal decimal(10,2) default null,
    estado char(1) not null,
    boleteria char(1) not null,
    fechaReserva bigint not null,
    fechaFacturacion bigint default null,
    turnoId int(11) default null,
    clienteDni int(11) not null,
    clienteNombre char(40) not null,
    clienteEmail char(50) default null,
    reservaPreferenceMpId int not null,
	eventoId int(11) not null,
    eventoNombre char(100) not null,
    ubicacionEventoId int(11) not null,
    ubicacionEventoEstado char(1) not null,
    ubicacionEventoFechaIngreso bigint default null,
    sectorEventoDescripcion char(150) not null,
    sectorEventoFechaFuncion bigint not null,
    descuentoSectorDescripcion char(45) not null,
    FOREIGN KEY (reservaPreferenceMpId) REFERENCES reservaReferenceMp (id)
);


create table if not exists securityMercadoPago (
	id int(11) not null auto_increment primary key,
	accessToken varchar(255) not null,
    publicKey varchar(255) not null,
    userIdMp bigint not null,
    nombreCuenta varchar(255) not null,
    nombre varchar(255) not null,
	eventoId int(11) not null
);

create table if not exists usuarios (
	id int(11) not null auto_increment primary key,
	username int(11) not null,
    pass varchar(100) not null
);

create table if not exists devoluciones (
	id int(11) not null auto_increment primary key,
    reservaId int(11) not null,
    motivo varchar(150) not null,
    fechaDevolucion bigint not null,
    usuarioEncargadoId int(11) not null,
    FOREIGN KEY ( reservaId ) REFERENCES reservas (id),
    FOREIGN KEY ( usuarioEncargadoId ) REFERENCES usuarios (id)
);

alter table usuarios add column `nameLastName` varchar(150) default null after `pass`;
alter table devoluciones add column `monto` decimal(10,2) default null after `usuarioEncargadoId`;

insert into `usuarios`(username,pass) values (25858046, 'miguel01');
SELECT * FROM reservas where id = 121980 and clienteDni = 40108490;

select * from reservaReferenceMp;
select * from reservas;
select * from securityMercadoPago;
select * from usuarios;

delete from reservaReferenceMp;
delete from reservas;
delete from securityMercadoPago;
delete from usuarios;
