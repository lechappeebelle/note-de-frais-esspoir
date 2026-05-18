<script>
    let { dépense, index, isOpen = false } = $props();
</script>

<fieldset>
    <details bind:open={isOpen}>
        <summary
            >{dépense.moisDépense}
            {dépense.annéeDépense} - {dépense.nomFournisseur}</summary
        >
        <label class="date">
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
            <textarea
                bind:value={dépense.commentaires}
                type="text"
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
    </details>
</fieldset>

<style lang="scss">
    input,
    select {
        border: 1px solid #341515;
        border-radius: 1px;
        padding: 0.2rem;
        margin: 0 0.2rem;
    }

    label {
        display: flex;
        flex-direction: column;

        margin-bottom: 0.7rem;
        padding-right: 4rem;

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
        border: 1px solid #341515;
        border-radius: 1px;
        margin: 0.5rem 0;

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
