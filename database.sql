create database if not exists mercadopagopaseshow;

create table if not exists reservas (
    ID int(11) not null primary key,
    TIPO char(3) not null,
    PREFIJO char(4) not null,
    NUMERO char(8) not null,
    IMPORTE_TOTAL decimal(10,2) not null,
    IMPORTE_TOTAL_NETO decimal(10,2) not null,
    SERVICE_CHARGE_TOTAL decimal(10,2) not null,
    ESTADO char(1) not null,
    BOLETERIA char(1) not null,
    FECHA_RESERVA datetime not null,
    FECHA_FACTURACION datetime not null,
    TURNO_ID int(11),
    CLIENTE_ID int(11) not null,
    VENDEDOR_ID int(11),
    RESERVA_REFERENCE_MP_ID int not null,
    FOREIGN KEY (RESERVA_REFERENCE_MP_ID) REFERENCES reserva_reference_mp (id)
)

create table if not exists reserva_reference_mp (
    ID int(11) not null auto_increment primary key,
    RESERVA_ID int(11) not null,
    REFERENCE_ID int not null,
    CLIENT_MP_ID int not null,
    COLLECTOR_ID int not null,
    STATUS_REFERENCE varchar(10) default "pending"
)