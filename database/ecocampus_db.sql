-- XAMPP-Lite
-- version 8.3.13
-- https://xampplite.sf.net/
--
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 11 nov. 2026 à 19:02
-- Version du serveur : 11.4.4-MariaDB-log
-- Version de PHP : 8.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ecocampus_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `password`) VALUES
(1, 'Admin', 'admin@ecocampus.tn', '$2y$10$dhQ7yncj38Ko1eQjI4/15uCGN1AHdC10kCJ6p9P9247K3unKY5Ecq'),
(2, 'Nada Barkaoui', 'nadabarkaoui@gmail.com', '$2y$10$qwk4ZdTe1l5ryAUCgWWvEuLeRRwUuYh.w5rvA/c7PoerDDNsMpi5i'),
(3, 'Iyed Ben Hmida', 'iyedbenhmida@gmail.com', '$2y$10$zTp5DtmX7c8J.15xbVZ9Xu9LUN9QhlKC6pM0GKlzqzCqgXRFAL0XG'),
(4, 'Ayoub Madyouni', 'ayoubmadyouni@gmail.com', '$2y$10$ZmxxArTdvOmx4uOVDsi4auz.z3FJXYTB0ouehiKY42nnueDW6fgri'),
(5, 'Adem Sfar', 'ademsfar@gmail.com', '$2y$10$BFECtF64F/8WBvBunXC4zucvLdp.K1dlXhY4qVryCy23YhxICFgqO'),
(6, 'Mohamed Iyadh Ghribi', 'iyadhghribi@gmail.com', '$2y$10$1CRLsSd7kX/SCYivXg/0huxYEK2gJlynX6qXqG8sfUL.VB0zKxpM6');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
