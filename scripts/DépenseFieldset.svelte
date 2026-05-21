<script>
    /** @typedef Dépense
     * @prop {Date} dateDépense - la date de la dépense
     * @prop {string} nomFournisseur - le nom du fournisseur
     * @prop {string} natureDépense - la nature de la dépense
     * @prop {string} motifDépense - le motif de la dépense
     * @prop {string} montantHT - le montant HT
     * @prop {string} montantTTC - le montant TTC
     * @prop {string} commentaires - des commentaires à propos de la dépense
     * @prop {FileList} justificatif - le justificatif de la dépense (plusieurs possibles ?)
     */

    /**
     *
     * @param {Date} d
     * @return {string} - une date au format `yyyy-mm-dd`
     */
    function toISOLocal(d) {
        const yyyy = d.toLocaleDateString("fr-FR", { year: "numeric" });
        const mm = d.toLocaleDateString("fr-FR", { month: "2-digit" });
        const dd = d.toLocaleDateString("fr-FR", { day: "2-digit" });

        return `${yyyy}-${mm}-${dd}`;
    }

    /**
     * @type {{dépense: Dépense}, index: number, isOpen: boolean}
     */
    let { dépense, index, isOpen = false } = $props();
    let dateSélectionnée = $state(toISOLocal(new Date()));

    function getDateDépenseString() {
        return dépense.dateDépense.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function changerLaDate() {
        dépense.dateDépense = new Date(dateSélectionnée);
    }
</script>

<fieldset>
    <details bind:open={isOpen}>
        <summary title="Masquer le contenu de cette dépense"
            >{getDateDépenseString()} - {dépense.nomFournisseur}</summary
        >
        <label>
            <span>Date</span>
            <input
                id={dateSélectionnée}
                type="date"
                bind:value={dateSélectionnée}
                onchange={changerLaDate}
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
            <textarea
                bind:value={dépense.commentaires}
                type="text"
                name="dépense{index + 1}commentaires"
            ></textarea>
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
    </details>
</fieldset>

<style lang="scss">
    input,
    select {
        border: 1px solid #372323;
        border-radius: 1px;
        padding: 0.2rem;
        margin: 0 0.2rem;
    }

    label {
        display: flex;
        flex-direction: column;
        margin-bottom: 0.7rem;

        @media (min-width: 1024px) {
            padding-right: 4rem;
        }

        &.date {
            flex-direction: row;

            span {
                flex-grow: 1;
            }
        }

        span {
            font-weight: bold;
        }

        &:last-of-type {
            margin-bottom: 2rem;
        }
    }

    fieldset {
        padding: 1rem;
        border: 1px solid #372323;
        border-radius: 1px;
        margin: 0.5rem 0;

        @media (prefers-color-scheme: dark) {
            & {
                border: 1px solid rgb(255, 249, 215);
            }
        }
        details {
            &[open] > summary::after {
                transform: rotate(-135deg);
            }

            summary {
                list-style: none;
                padding: 5px 20px 5px 0;
                font-weight: bold;
                font-size: 20px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            summary::after {
                content: "";
                border: solid;
                border-width: 0 3px 3px 0;
                display: inline-block;
                padding: 4px;
                transition: 0.3s;
                transform: rotate(45deg);
            }

            summary::-webkit-details-marker {
                display: none;
            }
        }
    }
</style>
