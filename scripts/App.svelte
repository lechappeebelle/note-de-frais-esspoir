<script>
	/** @typedef Dépense
	 * @prop {string} jourDépense - le jour de la dépense
	 * @prop {string} moisDépense - le mois de la dépense
	 * @prop {string} annéeDépense - l'année de la dépense
	 * @prop {string} nomFournisseur - le nom du fournisseur
	 * @prop {string} natureDépense - la nature de la dépense
	 * @prop {string} motifDépense - le motif de la dépense
	 * @prop {string} montantHT - le montant HT
	 * @prop {string} montantTTC - le montant TTC
	 * @prop {string} commentaires - des commentaires à propos de la dépense
	 * @prop {FileList} justificatif - le justificatif de la dépense (plusieurs possibles ?)
	 */

	let nomEtPrénom;
	let responsableOpérationnel = ""; // à faire un jour
	let fonctionLibellé;
	let mois;
	let année;

	/** @type {Set<Dépense>} */
	let dépenses = new Set([
		{
			jourDépense: "",
			moisDépense: "",
			annéeDépense: "",
			nomFournisseur: "",
			natureDépense: "",
			motifDépense: "",
			montantHT: "",
			montantTTC: "",
			commentaires: "",
			justificatifs: [],
		},
	]);

	const maintenant = new Date();

	mois = maintenant.toLocaleDateString("fr-FR", { month: "long" });
	année = maintenant.toLocaleDateString("fr-FR", { year: "numeric" });

	async function créerRécapNDF(e) {
		e.preventDefault();

		const data = {
			nomEtPrénom,
			responsableOpérationnel, // à faire un jour
			fonctionLibellé,
			mois,
			année,
			dépenses,
		};

		/** @type {ArrayBuffer}*/
		let ndfArrayBuffer; // comment on fait un pdf ?

		télécharger(
			new Blob([ndfArrayBuffer], {
				type: "application/application/pdf",
			}),
			`${nomEtPrénom} - NDF ${mois} ${année}.pdf`,
		);
	}

	async function télécharger(blob, nomFichier) {
		const link = document.createElement("a");
		link.download = nomFichier;
		link.href = URL.createObjectURL(blob);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<h1>L'Échappée Belle - Notes de frais</h1>

<form on:submit={créerRécapNDF}>
	<label>
		<span>Nom et prénom de la personne réalisant la NDF</span>
		<input
			bind:value={nomEtPrénom}
			type="text"
			autocomplete="on"
			name="nomEtPrénom"
		/>
	</label>
	<label>
		<span>Fonction de la personne réalisant la NDF</span>
		<input
			bind:value={fonctionLibellé}
			type="text"
			autocomplete="on"
			name="fonctionLibellé"
		/>
	</label>
	<label>
		<span>Période de la NDF</span>
		<!-- Faire un composant de date -->
		<select bind:value={mois}>
			<option>janvier</option>
			<option>février</option>
			<option>mars</option>
			<option>avril</option>
			<option>mai</option>
			<option>juin</option>
			<option>juillet</option>
			<option>août</option>
			<option>septembre</option>
			<option>octobre</option>
			<option>novembre</option>
			<option>décembre</option>
		</select>
		<input bind:value={année} type="number" min="2020" step="1" />
	</label>
	<h2>Dépenses</h2>
	{#each dépenses as dépense, index}
		<fieldset>
			<legend>Dépense {index + 1}</legend>

			<label>
				<span>Date</span>
				<select bind:value={dépense.moisDépense}>
					<option>janvier</option>
					<option>février</option>
					<option>mars</option>
					<option>avril</option>
					<option>mai</option>
					<option>juin</option>
					<option>juillet</option>
					<option>août</option>
					<option>septembre</option>
					<option>octobre</option>
					<option>novembre</option>
					<option>décembre</option>
				</select>
				<input
					bind:value={dépense.annéeDépense}
					type="number"
					min="2020"
					step="1"
				/>
			</label>
			<label>
				<span>Nom du fournisseur</span>
				<input
					bind:value={dépense.nomFournisseur}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}NomFournisseur"
				/>
			</label>
			<label>
				<span>Nature de la dépense</span>
				<input
					bind:value={dépense.natureDépense}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}NatureDépense"
				/>
			</label>
			<label>
				<span>Motif de la dépense</span>
				<input
					bind:value={dépense.motifDépense}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}MotifDépense"
				/>
			</label>
			<label>
				<span>Montant HT de la dépense</span>
				<input
					bind:value={dépense.montantHT}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}MontantHT"
				/>
			</label>
			<label>
				<span>Montant TTC de la dépense</span>
				<input
					bind:value={dépense.montantTTC}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}MontantTTC"
				/>
			</label>
			<label>
				<span>Commentaires</span>
				<input
					bind:value={dépense.commentaires}
					type="text"
					autocomplete="on"
					name="dépense{index + 1}commentaires"
				/>
			</label>
			<label>
				<span>Justificatif</span>
				<input
					bind:files={dépense.justificatif}
					accept=".jpg, .jpeg, .png, .pdf, .gif"
					type="file"
					name="dépense{index + 1}Justificatif"
				/>
			</label>
		</fieldset>
	{/each}

	<button type="submit">Créer le récap de notes de frais 🚀</button>
</form>

<style lang="scss">
	:global(main) {
		display: flex;

		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;

		@media (min-width: 640px) {
			max-width: 80rem;
		}
	}

	form {
		display: flex;
		flex-direction: column;

		label {
			display: flex;
			flex-direction: column;

			margin-bottom: 0.7rem;

			span {
				font-weight: bold;
			}

			&:last-of-type {
				margin-bottom: 2rem;
			}
		}

		button {
			font-size: 1.2rem;
			width: 10rem;
			padding: 0.7rem;
		}
	}
</style>
